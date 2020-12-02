import { Entity, Property, ManyToMany, Collection, OneToMany, OneToOne } from "@mikro-orm/core";
import { ObjectType, Field } from "@nestjs/graphql";

import { CONDOMINIUM, PERSON_CONDOMINIUM } from "../utils/constants";
import { Address } from "./address.model";
import { BaseModel } from "./base.model";
import { Block } from "./block.model";
import { Local } from "./local.model";
import { Person } from "./person.model";

@ObjectType(CONDOMINIUM)
@Entity({ tableName: CONDOMINIUM })
export class Condominium extends BaseModel {
  @Field()
  @Property()
  public companyName!: string;

  @Field()
  @Property({ unique: true })
  public cnpj!: string;

  @Field({ defaultValue: "#" })
  @Property({ default: "#" })
  public character!: string;

  @Field(() => [Block])
  @OneToMany({ entity: () => Block, mappedBy: (block) => block.condominium })
  public blocks: Collection<Block> = new Collection<Block>(this);

  @Field(() => [Local])
  @OneToMany({ entity: () => Local, mappedBy: (local) => local.condominium })
  public locals: Collection<Local> = new Collection<Local>(this);

  @Field(() => Address)
  @OneToOne({ entity: () => Address, mappedBy: (address) => address.condominium })
  public address!: Address;

  @Field(() => [Person])
  @ManyToMany({
    entity: () => Person,
    pivotTable: PERSON_CONDOMINIUM,
    joinColumn: "condominium",
    inverseJoinColumn: "person",
  })
  public people: Collection<Person> = new Collection<Person>(this);
}
