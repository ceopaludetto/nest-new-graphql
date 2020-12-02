import { Injectable } from "@nestjs/common";
import type { GraphQLSchema } from "graphql";

@Injectable()
export class SchemaService {
  private graphqlSchema!: GraphQLSchema;

  public setSchema(s: GraphQLSchema) {
    this.graphqlSchema = s;
  }

  public get schema() {
    return this.graphqlSchema;
  }
}
