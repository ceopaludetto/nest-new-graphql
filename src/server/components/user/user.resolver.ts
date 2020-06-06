import { Resolver, Args, Mutation, Query } from "@nestjs/graphql";

import { User } from "@/server/models";
// import { FindByID, ShowAll } from "@/server/utils/common.dto";

import { UserInsertInput } from "./user.dto";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  public constructor(private readonly userService: UserService) {}

  // @Query(() => [User])
  // public async showUsers(@Args() { skip, first }: ShowAll) {
  //   return this.userService.showAll(skip, first);
  // }

  @Query(() => User)
  public async findUser() {
    return this.userService.find();
  }

  @Mutation(() => User)
  public async create(@Args("input") data: UserInsertInput) {
    return this.userService.create(data);
  }
}
