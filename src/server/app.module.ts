import { EntityCaseNamingStrategy } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { MailerModule } from "@nestjs-modules/mailer";
import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import type { GraphQLSchema } from "graphql";
import { LoggerModule, PinoLogger } from "nestjs-pino";

import {
  ConfigurationService,
  AuthenticationModule,
  ConfigurationModule,
  CondominiumModule,
  PersonModule,
  ReactModule,
  QueueModule,
  StateModule,
  CityModule,
  UserModule,
  BlockModule,
} from "@/server/components";
import * as entities from "@/server/models";
import type { ContextType } from "@/server/utils/common.dto";
import { APP_NAME } from "@/server/utils/constants";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        base: { name: APP_NAME },
        messageKey: "message",
        autoLogging: process.env.NODE_ENV === "production",
        level: process.env.NODE_ENV !== "production" ? "debug" : "info",
        prettyPrint:
          process.env.NODE_ENV === "development"
            ? {
                translateTime: "dd/mm/yyyy, hh:MM:ss:l",
                ignore: "context,pid,req",
                levelFirst: true,
              }
            : false,
      },
    }),
    ConfigurationModule,
    MikroOrmModule.forRootAsync({
      inject: [ConfigurationService, PinoLogger],
      useFactory: ({ database }: ConfigurationService, logger: PinoLogger) => ({
        type: database.type,
        dbName: database.database,
        host: database.host,
        port: database.port,
        user: database.username,
        password: database.password,
        namingStrategy: EntityCaseNamingStrategy,
        debug: database.logger && ["query"],
        entities: Object.values(entities).filter((x) => typeof x === "function") as any,
        discovery: { disableDynamicFileAccess: true }, // due to webpack usage
        tsNode: false,
        logger: (msg: string) => logger.debug(msg),
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: async ({ mailer }: ConfigurationService) => ({
        transport: {
          host: mailer.host,
          port: mailer.port,
          auth: mailer.auth,
        },
        template: {
          dir: mailer.template.dir,
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    GraphQLModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: async ({ graphql, setSchema }: ConfigurationService) => ({
        autoSchemaFile: graphql.schema ?? true,
        installSubscriptionHandlers: true,
        debug: process.env.NODE_ENV === "development",
        playground: process.env.NODE_ENV === "development",
        introspection: process.env.NODE_ENV === "development",
        cors: false,
        uploads: true,
        context: ({ req, res }: ContextType) => ({ req, res }),
        transformSchema: (s: GraphQLSchema) => {
          setSchema(s);
          return s;
        },
      }),
    }),
    QueueModule,
    UserModule,
    PersonModule,
    AuthenticationModule,
    CondominiumModule,
    ReactModule,
    StateModule,
    CityModule,
    BlockModule,
  ],
})
export class ApplicationModule {}
