/* eslint-disable no-undef */
import { Injectable, PipeTransform } from "@nestjs/common";
import { Info } from "@nestjs/graphql";
import type { GraphQLResolveInfo } from "graphql";

import { GraphQLFieldsToRelations } from "./fields.to.relation";

@Injectable()
class MapFieldsPipe implements PipeTransform {
  public constructor(private readonly root?: string) {}

  public transform(value: GraphQLResolveInfo) {
    const fields = GraphQLFieldsToRelations(value as any, { exclude: ["__typename"], root: this.root });

    return fields;
  }
}

export const MapFields = (root?: string) => Info(new MapFieldsPipe(root));
