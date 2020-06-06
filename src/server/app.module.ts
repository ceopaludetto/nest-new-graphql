// import { MailerModule } from "@nestjs-modules/mailer";
// import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
// import { SequelizeModule } from "@nestjs/sequelize";
import { GraphQLSchema } from "graphql";
// import { LoggerModule, PinoLogger } from "nestjs-pino";

import {
  ConfigurationModule,
  ConfigurationService,
  UserModule,
  // AuthenticationModule,
  // ReactModule,
  // QueueModule,
} from "@/server/components";
// import { entities } from "@/server/models";
import { ContextType } from "@/server/utils/common.dto";
// import { APP_NAME } from "@/server/utils/constants";

@Module({
  imports: [
    // QueueModule,
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     name: APP_NAME,
    //     autoLogging: process.env.NODE_ENV === "production",
    //     level: process.env.NODE_ENV !== "production" ? "debug" : "info",
    //     prettyPrint:
    //       process.env.NODE_ENV === "development"
    //         ? {
    //             translateTime: "dd/mm/yyyy, hh:MM:ss:l",
    //             ignore: "context,pid,req",
    //             levelFirst: true,
    //           }
    //         : false,
    //   },
    // }),
    ConfigurationModule,
    // SequelizeModule.forRootAsync({
    //   inject: [ConfigurationService, PinoLogger],
    //   useFactory: ({ database }: ConfigurationService, logger: PinoLogger) => ({
    //     dialect: database.dialect || "postgres",
    //     host: database.host,
    //     port: database.port,
    //     database: database.database,
    //     username: database.username,
    //     password: database.password,
    //     ssl: database.ssl || false,
    //     logging: database.logger ? (sql) => logger.debug(sql) : false,
    //     models: entities,
    //   }),
    // }),
    // MailerModule.forRootAsync({
    //   inject: [ConfigurationService],
    //   useFactory: async ({ mailer }: ConfigurationService) => ({
    //     transport: {
    //       host: mailer.host,
    //       port: mailer.port,
    //       auth: mailer.auth,
    //     },
    //     template: {
    //       dir: mailer.template.dir,
    //       adapter: new PugAdapter(),
    //       options: {
    //         strict: true,
    //       },
    //     },
    //   }),
    // }),
    GraphQLModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: async ({ graphql, setSchema }: ConfigurationService) => ({
        autoSchemaFile: graphql.schema ?? true,
        installSubscriptionHandlers: true,
        debug: process.env.NODE_ENV === "development",
        playground: process.env.NODE_ENV === "development",
        context: ({ req, res }: ContextType) => ({ req, res }),
        transformSchema: (schema: GraphQLSchema) => {
          setSchema(schema);
          return schema;
        },
      }),
    }),
    UserModule,
    // AuthenticationModule,
    // ReactModule,
  ],
})
export class ApplicationModule {}
