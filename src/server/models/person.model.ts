import { Entity, Property, Enum, OneToOne, OneToMany, Collection, ManyToMany } from "@mikro-orm/core";
import { ObjectType, Field, registerEnumType } from "@nestjs/graphql";

import { PERSON } from "../utils/constants";
import { Gender } from "../utils/enums";
import { BaseModel } from "./base.model";
import { Condominium } from "./condominium.model";
import { Phone } from "./phone.model";
import { User } from "./user.model";

registerEnumType(Gender, {
  name: "Gender",
});

@ObjectType(PERSON)
@Entity({ tableName: PERSON })
export class Person extends BaseModel {
  @Field()
  @Property()
  public name!: string;

  @Field()
  @Property()
  public lastName!: string;

  @Field()
  @Property({ unique: true })
  public email!: string;

  @Field(() => Gender)
  @Enum(() => Gender)
  public gender!: Gender;

  @Field()
  @Property()
  public cpf!: string;

  @Field()
  @Property()
  public birthdate!: Date;

  @Field(() => [Phone])
  @OneToMany({ entity: () => Phone, mappedBy: (phone) => phone.person, orphanRemoval: true })
  public phones: Collection<Phone> = new Collection<Phone>(this);

  @Field(() => User)
  @OneToOne({ entity: () => User, mappedBy: (user) => user.person })
  public user!: User;

  @Field(() => [Condominium])
  @ManyToMany({
    entity: () => Condominium,
    mappedBy: (condominium) => condominium.people,
  })
  public condominiums: Collection<Condominium> = new Collection<Condominium>(this);
}
