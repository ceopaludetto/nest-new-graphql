import type { Options } from "@mikro-orm/core";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const config: Options = {
  type: process.env.DATABASE_TYPE as "postgresql",
  dbName: process.env.DATABASE_DB,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 5432,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  entities: ["./src/server/models"],
  migrations: {
    emit: "ts",
    tableName: "DatabaseStatus",
    path: "./src/server/database/migrations",
    allOrNothing: false,
    transactional: true,
  },
};

export default config;
