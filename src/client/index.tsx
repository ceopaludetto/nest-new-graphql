import * as React from "react";
import * as ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

import { ApolloProvider } from "@apollo/client";
import { loadableReady } from "@loadable/component";
import { createUploadLink } from "apollo-upload-client";

import { createClient } from "@/client/providers/apollo";

import { App } from "./App";

const client = createClient(
  false,
  createUploadLink({
    credentials: "same-origin",
    uri: "/graphql",
  }) as any
);

// eslint-disable-next-line promise/catch-or-return
loadableReady().then(() => {
  const root = document.querySelector("#app");
  const method: "render" | "hydrate" = root?.hasChildNodes() ? "hydrate" : "render";

  return ReactDOM[method](
    <HelmetProvider>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <App cookies={document.cookie} />
        </BrowserRouter>
      </ApolloProvider>
    </HelmetProvider>,
    root,
    () => {
      const jssStyles = document.querySelector("#jss-server-side");
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  );
});

if (module.hot) {
  module.hot.accept();
}
