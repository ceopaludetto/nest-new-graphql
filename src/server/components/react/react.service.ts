import { matchPath } from "react-router-dom";

import { SchemaLink } from "@apollo/client/link/schema";
import { Injectable } from "@nestjs/common";
import type { Request, Response } from "express";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";

import { LoggedDocument, LoggedQuery, SelectedCondominiumDocument, SelectedCondominiumQuery } from "@/client/graphql";
import { createClient } from "@/client/providers/apollo";
import { AuthenticationService } from "@/server/components/authentication";
import { ConfigurationService } from "@/server/components/configuration";
import { REFRESH_TOKEN } from "@/server/utils/constants";

import { ReactRenderService } from "./react.render.service";

@Injectable()
export class ReactService {
  public constructor(
    private readonly configService: ConfigurationService,
    private readonly authenticationService: AuthenticationService,
    private readonly renderService: ReactRenderService,
    @InjectPinoLogger(ReactService.name) private readonly logger: PinoLogger
  ) {}

  public async getCurrentUser(request: Request) {
    const refreshCookie = request.cookies[REFRESH_TOKEN];

    if (refreshCookie) {
      const [, token] = refreshCookie.split(" ");

      const decoded = await this.authenticationService.verifyToken(token);
      const user = await this.authenticationService.getByRefreshToken(decoded, ["person.condominiums"]);

      return user;
    }

    return undefined;
  }

  public async render(req: Request, res: Response) {
    try {
      const user = await this.getCurrentUser(req);

      const client = createClient(
        true,
        new SchemaLink({
          schema: this.configService.schema,
          context: (operation) => {
            const ctx = operation.getContext();

            try {
              // get selected condominium in cache
              const selected = ctx.cache.readQuery({
                query: SelectedCondominiumDocument,
              });

              if (selected.selectedCondominium) {
                req.headers = { ...req.headers, "x-condominium": selected.selectedCondominium };
              }
            } catch (error) {
              return { req, res };
            }

            return { req, res };
          },
        })
      );

      client.cache.writeQuery<LoggedQuery>({
        query: LoggedDocument,
        data: {
          __typename: "Query",
          logged: !!user,
        },
      });

      const match = matchPath(req.url, {
        path: "/app/:condominium",
      });

      if (user?.person.condominiums && match) {
        let condominium = user.person.condominiums[0].id;

        if (user.person.condominiums.toArray().some((c) => c.id === (match?.params as any)?.condominium)) {
          condominium = (match?.params as Record<string, any>)?.condominium;
        }

        client.cache.writeQuery<SelectedCondominiumQuery>({
          query: SelectedCondominiumDocument,
          data: {
            __typename: "Query",
            selectedCondominium: condominium,
          },
        });
      }

      const html = await this.renderService.render(req, res, client, user);

      return res.send(`<!DOCTYPE html>${html}`);
    } catch (error) {
      this.logger.error(error?.message ?? error ?? "Falha ao renderizar React");
      return res.send({ error: true, message: "Falha ao renderizar React" });
    }
  }
}
