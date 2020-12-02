import { Entity, Property, OneToOne } from "@mikro-orm/core";
import { ObjectType, Field } from "@nestjs/graphql";

import { ADDRESS } from "../utils/constants";
import { BaseModel } from "./base.model";
import { City } from "./city.model";
import { Condominium } from "./condominium.model";

@Entity({ tableName: ADDRESS })
@ObjectType(ADDRESS)
export class Address extends BaseModel {
  @Field()
  @Property()
  public zip!: string;

  @Field()
  @Property()
  public address!: string;

  @Field()
  @Property()
  public number!: string;

  @Field(() => Condominium)
  @OneToOne({
    entity: () => Condominium,
    inversedBy: (condominium) => condominium.address,
    owner: true,
  })
  public condominium!: Condominium;

  @Field(() => City)
  @OneToOne({
    entity: () => Condominium,
    inversedBy: (city) => city.address,
    owner: true,
  })
  public city!: City;
}
