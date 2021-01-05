import { INestApplication, ValidationPipe } from "@nestjs/common";
import { UserInputError } from "apollo-server-express";
import compression from "compression";
import cookie from "cookie-parser";
import { static as serve } from "express";
import helmet from "helmet";
import path from "path";

import { formatErrors } from "./validations/format";

export async function installMiddlewares(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UserInputError("Erro de validação", formatErrors(errors)),
    })
  );

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  if (!process.env.NO_SERVE) {
    if (process.env.NODE_ENV === "production") {
      app.use(compression());
    }

    app.use(
      serve(process.env.RAZZLE_PUBLIC_DIR as string, {
        maxAge: process.env.NODE_ENV === "production" ? "1y" : undefined,
      })
    );

    app.use(
      "/image",
      serve(path.resolve("uploads"), {
        maxAge: process.env.NODE_ENV === "production" ? "1y" : undefined,
      })
    );
  }

  app.use(cookie());
}
