import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { useContainer as installClassValidationContainer } from "class-validator";
import { Logger } from "nestjs-pino";

import { installMiddlewares } from "@/server/utils/middlewares";

import { ApplicationModule } from "./app.module";
import "./utils/patch"; // FIXME: https://github.com/typestack/class-transformer/pull/262

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ApplicationModule, { logger: false });
  const logger = app.get(Logger);
  app.useLogger(logger);

  installClassValidationContainer(app.select(ApplicationModule), { fallbackOnErrors: true });
  await installMiddlewares(app);

  const port = process.env.PORT || 3333;
  await app.listen(port);
  logger.log(`Application listen in port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
