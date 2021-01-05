import { EntityCaseNamingStrategy } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { MailerModule } from "@nestjs-modules/mailer";
import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import type { GraphQLSchema } from "graphql";
import { LoggerModule, PinoLogger } from "nestjs-pino";

import {
  AuthenticationModule,
  CondominiumModule,
  PersonModule,
  ReactModule,
  QueueModule,
  StateModule,
  CityModule,
  UserModule,
  BlockModule,
  SchemaModule,
  SchemaService,
  UploadModule,
} from "@/server/components";
import * as entities from "@/server/models";
import type { ContextType } from "@/server/utils/common.dto";
import { APP_NAME } from "@/server/utils/constants";
import { validate } from "@/server/utils/validations/configuration";
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? "development"}`,
      validate,
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService, PinoLogger],
      useFactory: (configService: ConfigService, logger: PinoLogger) => ({
        type: configService.get("DATABASE_TYPE"),
        dbName: configService.get("DATABASE_DB"),
        host: configService.get("DATABASE_HOST"),
        port: configService.get("DATABASE_PORT"),
        user: configService.get("DATABASE_USERNAME"),
        password: configService.get("DATABASE_PASSWORD"),
        namingStrategy: EntityCaseNamingStrategy,
        debug: configService.get("DATABASE_LOGGER") && ["query", "query-params"],
        entities: Object.values(entities).filter((x) => typeof x === "function") as any,
        discovery: { disableDynamicFileAccess: true }, // due to webpack usage
        tsNode: false,
        logger: (msg: string) => logger.debug(msg),
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("MAILER_HOST"),
          port: configService.get<number>("MAILER_PORT"),
          auth: {
            user: configService.get<string>("MAILER_AUTH_USER"),
            pass: configService.get<string>("MAILER_AUTH_PASS"),
          },
        },
        template: {
          dir: configService.get("MAILER_TEMPLATES"),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    GraphQLModule.forRootAsync({
      imports: [SchemaModule],
      inject: [ConfigService, SchemaService],
      useFactory: async (configService: ConfigService, schemaService: SchemaService) => ({
        autoSchemaFile: configService.get<string>("GRAPHQL_SCHEMA") ?? true,
        installSubscriptionHandlers: true,
        debug: process.env.NODE_ENV === "development",
        playground: process.env.NODE_ENV === "development",
        introspection: process.env.NODE_ENV === "development",
        cors: false,
        uploads: true,
        context: ({ req, res }: ContextType) => ({ req, res }),
        transformSchema: (s: GraphQLSchema) => {
          schemaService.setSchema(s);
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
    SchemaModule,
    UploadModule,
  ],
})
export class ApplicationModule {}
