import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { ObjectType, Field } from "@nestjs/graphql";

import { PHONE } from "../utils/constants";
import { BaseModel } from "./base.model";
import { Person } from "./person.model";

@ObjectType(PHONE)
@Entity({ tableName: PHONE })
export class Phone extends BaseModel {
  @Field()
  @Property()
  public ddd!: string;

  @Field()
  @Property()
  public number!: string;

  @Field(() => Person)
  @ManyToOne({ entity: () => Person })
  public person!: Person;
}
