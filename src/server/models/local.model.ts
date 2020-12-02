import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { ObjectType, Field } from "@nestjs/graphql";

import { LOCAL } from "../utils/constants";
import { BaseModel } from "./base.model";
import { Block } from "./block.model";
import { Condominium } from "./condominium.model";

@ObjectType(LOCAL)
@Entity({ tableName: LOCAL })
export class Local extends BaseModel {
  @Field()
  @Property()
  public name!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  public description?: string;

  @Field()
  @Property()
  public capacity!: number;

  @Field({ nullable: true })
  @Property({ nullable: true })
  public image?: string;

  @Field(() => Block, { nullable: true })
  @ManyToOne({ entity: () => Block, nullable: true })
  public block?: Block;

  @Field(() => Condominium)
  @ManyToOne({ entity: () => Condominium })
  public condominium!: Condominium;
}
