import { InMemoryCache, ApolloClient, ApolloLink } from "@apollo/client";

import { SelectedCondominiumDocument } from "@/client/graphql";

import { AccessToken } from "./token";

export const tokenStore = new AccessToken();

const contextLink = new ApolloLink((operation, forward) => {
  const context = operation.getContext();

  try {
    const selected = context.cache.readQuery({
      query: SelectedCondominiumDocument,
    });

    if (selected.selectedCondominium) {
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

const saveTokenLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();

    const token = context.response.headers.get("X-Access-Token");
    if (token) {
      tokenStore.set(token.trim());
    }

    return response;
  });
});

const getTokenLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }: any) => ({
    headers: tokenStore.has() ? { "X-Access-Token": tokenStore.get(), ...headers } : headers,
  }));

  return forward(operation);
});

export function createClient(isSsr = false, link: ApolloLink) {
  let cache = new InMemoryCache();

  if (!isSsr) {
    const apolloState = document.querySelector("#__APOLLO_STATE__");
    if (apolloState) {
      cache = cache.restore(JSON.parse(apolloState.innerHTML));

      if (process.env.NODE_ENV === "production") {
        apolloState.parentElement?.removeChild(apolloState);
      }
    }
  }

  const client = new ApolloClient({
    cache,
    link: isSsr ? link : ApolloLink.from([contextLink, saveTokenLink, getTokenLink, link]),
    ssrMode: isSsr,
    connectToDevTools: process.env.NODE_ENV === "development" && typeof window !== "undefined",
    assumeImmutableResults: true,
  });

  return client;
}
