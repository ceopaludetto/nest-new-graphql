/* eslint-disable react/no-danger */
import * as React from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { FilledContext, HelmetProvider } from "react-helmet-async";
import { StaticRouter } from "react-router-dom";

import { ApolloProvider, ApolloClient } from "@apollo/client";
import { getMarkupFromTree } from "@apollo/client/react/ssr";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import { ServerStyleSheets } from "@material-ui/styles";
import { Injectable } from "@nestjs/common";
import type { Request, Response } from "express";
import { generate } from "shortid";

import { App } from "@/client/App";
import type { ReactStaticContext } from "@/client/utils/common.dto";
import type { User } from "@/server/models";

@Injectable()
export class ReactRenderService {
  public async render(req: Request, res: Response, client: ApolloClient<any>, user?: User) {
    const sheets = new ServerStyleSheets();
    const nonce = Buffer.from(generate()).toString("base64");
    const extractor = new ChunkExtractor({
      statsFile: process.env.RAZZLE_LOADABLE_MANIFEST as string,
      entrypoints: ["client"],
    });
    const context: ReactStaticContext = {};
    const helmetContext: FilledContext | Record<string, any> = {};

    if (process.env.NODE_ENV === "production") {
      res.set(
        "Content-Security-Policy",
        `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}'; font-src 'self';`
      );
    }

    const markup = await getMarkupFromTree({
      tree: (
        <ChunkExtractorManager extractor={extractor}>
          <HelmetProvider context={helmetContext}>
            <ApolloProvider client={client}>
              <StaticRouter context={context} location={req.url}>
                <App logged={!!user} cookies={req.headers.cookie ?? ""} />
              </StaticRouter>
            </ApolloProvider>
          </HelmetProvider>
        </ChunkExtractorManager>
      ),
      renderFunction: (el) => renderToString(sheets.collect(el)),
    });

    const initialState = client.extract();

    if (context.url) {
      return res.status(context?.statusCode ?? 307).redirect(context.url);
    }

    const { helmet } = helmetContext as FilledContext;

    const { htmlAttributes, bodyAttributes } = helmet;

    const linkEls = extractor.getLinkElements();
    const styleEls = extractor.getStyleElements({ nonce });
    const scriptEls = extractor.getScriptElements({ nonce });

    return renderToStaticMarkup(
      <html lang="pt-BR" {...htmlAttributes.toComponent()}>
        <head>
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          <meta property="csp-nonce" content={nonce} />
          {linkEls}
          {helmet.link.toComponent()}
          {styleEls}
          {sheets.getStyleElement({ nonce })}
        </head>
        <body {...bodyAttributes.toComponent()}>
          <div id="app" dangerouslySetInnerHTML={{ __html: markup }} />
          <script
            nonce={nonce}
            id="__APOLLO_STATE__"
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(initialState).replace(/</g, "\\u003c"),
            }}
          />
          {scriptEls}
        </body>
      </html>
    );
  }
}
