import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { ObjectType, Field } from "@nestjs/graphql";

import { CITY } from "../utils/constants";
import { BaseModel } from "./base.model";
import { State } from "./state.model";

@ObjectType(CITY)
@Entity({ tableName: CITY })
export class City extends BaseModel {
  @Field()
  @Property()
  public name!: string;

  @Field()
  @Property({ unique: true })
  public code!: number;

  @Field()
  @Property()
  public slug!: string;

  @Field(() => State)
  @ManyToOne({ entity: () => State })
  public state!: State;
}
