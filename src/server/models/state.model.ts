import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { ObjectType, Field } from "@nestjs/graphql";

import { STATE } from "../utils/constants";
import { BaseModel } from "./base.model";
import { City } from "./city.model";

@ObjectType(STATE)
@Entity({ tableName: STATE })
export class State extends BaseModel {
  @Field()
  @Property()
  public name!: string;

  @Field()
  @Property({ unique: true })
  public initials!: string;

  @Field()
  @Property({ unique: true })
  public code!: number;

  @Field(() => [City])
  @OneToMany({ entity: () => City, mappedBy: (city) => city.state })
  public cities: Collection<City> = new Collection<City>(this);
}
