import { InMemoryCache, ApolloClient, ApolloLink } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

import { SelectedCondominiumDocument } from "@/client/graphql/index.graphql";

import { AccessToken } from "./token";

export const tokenStore = new AccessToken();

const contextLink = new ApolloLink((operation, forward) => {
  const context = operation.getContext();

  try {
    const selected = context.cache.readQuery({
      query: SelectedCondominiumDocument,
    });

    if (selected?.selectedCondominium) {
      operation.setContext(({ headers }: any) => ({
        headers: {
          "X-Condominium": selected.selectedCondominium,
          ...headers,
        },
      }));
    }
  } catch (error) {
    return forward(operation);
  }

  return forward(operation);
});

const saveTokenLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    const context = operation.getContext();

    const token = context.response.headers.get("x-access-token");
    if (token) {
      tokenStore.set(token.trim());
    }

    return response;
  })
);

const getTokenLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }: any) => ({
    headers: tokenStore.has() ? { "X-Access-Token": tokenStore.get(), ...headers } : headers,
  }));

  return forward(operation);
});

export function createClient(isSsr = false, link: ApolloLink) {
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          findBlockByID(existing, { args, toReference }) {
            return (
              existing ||
              toReference({
                __typename: "Block",
                id: args?.id,
              })
            );
          },
          showBlocks: relayStylePagination(),
          showStates: relayStylePagination(),
        },
      },
    },
  });

  if (!isSsr) {
    const apolloState = document.querySelector("#__APOLLO_STATE__");
    if (apolloState) {
      cache.restore(JSON.parse(apolloState.innerHTML));

      if (process.env.NODE_ENV === "production") {
        apolloState.parentElement?.removeChild(apolloState);
      }
    }
  }

  const client = new ApolloClient({
    cache,
    link: ApolloLink.from([contextLink, saveTokenLink, getTokenLink, link]),
    ssrMode: isSsr,
    connectToDevTools: process.env.NODE_ENV === "development" && !isSsr,
    assumeImmutableResults: true,
    credentials: "include",
  });

  return client;
}
