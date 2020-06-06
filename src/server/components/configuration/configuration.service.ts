import { Injectable } from "@nestjs/common";
import fs from "fs";
import { GraphQLSchema } from "graphql";
// import { PinoLogger } from "nestjs-pino";
import { Dialect } from "sequelize";
import yaml from "yaml";
import * as Yup from "yup";

import { REQUIRED, DIALECT } from "@/server/utils/constants";

const EnvSchema = Yup.object({
  database: Yup.object({
    dialect: Yup.mixed<Dialect>()
      .oneOf(["mysql", "postgres", "sqlite", "mariadb", "mssql", "mariadb"], DIALECT)
      .required(REQUIRED),
    host: Yup.string().required(REQUIRED),
    port: Yup.number().required(REQUIRED),
    database: Yup.string().required(REQUIRED),
    username: Yup.string().required(REQUIRED),
    password: Yup.string().required(REQUIRED),
    ssl: Yup.boolean(),
    logger: Yup.boolean(),
  }),
  queue: Yup.object({
    host: Yup.string().required(REQUIRED),
    port: Yup.number().required(REQUIRED),
  }),
  mailer: Yup.object({
    host: Yup.string().required(REQUIRED),
    port: Yup.number().required(REQUIRED),
    auth: Yup.object({
      user: Yup.string().required(REQUIRED),
      pass: Yup.string().required(REQUIRED),
    }),
    template: Yup.object({
      dir: Yup.string(),
    }),
  }),
  auth: Yup.object({
    secret: Yup.string().required(REQUIRED),
  }),
  graphql: Yup.object({
    schema: Yup.string(),
  }),
});

type EnvConfig = Yup.InferType<typeof EnvSchema>;

@Injectable()
export class ConfigurationService {
  private readonly envConfig!: EnvConfig;

  private graphqlSchema!: GraphQLSchema;

  public constructor(filePath: string) {
    const config = yaml.parse(fs.readFileSync(filePath, "UTF-8"));
    const validated = this.validateInput(config);
    if (validated !== false) {
      this.envConfig = validated;
    }
  }

  private validateInput = (config: any) => {
    try {
      EnvSchema.validateSync(config, { abortEarly: true });

      return config as EnvConfig;
    } catch (error) {
      // if (error instanceof Yup.ValidationError) {
      //   this.logger.error(error.message);
      // }

      return false;
    }
  };

  public get database() {
    return this.envConfig.database;
  }

  public get auth() {
    return this.envConfig.auth;
  }

  public get graphql() {
    return this.envConfig.graphql;
  }

  public get queue() {
    return this.envConfig.queue;
  }

  public get mailer() {
    return this.envConfig.mailer;
  }

  public setSchema = (schema: GraphQLSchema) => {
    this.graphqlSchema = schema;
  };

  public get schema() {
    return this.graphqlSchema;
  }
}
