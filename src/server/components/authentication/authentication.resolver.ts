import { UseGuards } from "@nestjs/common";
import { Resolver, Mutation, Query, Args, Context } from "@nestjs/graphql";

import { UserInsertInput, UserService } from "@/server/components/user";
import { User } from "@/server/models";
import { ContextType } from "@/server/utils/common.dto";
import type { Mapped } from "@/server/utils/common.dto";
import { REFRESH_TOKEN } from "@/server/utils/constants";
import { MapFields } from "@/server/utils/plugins";

import { AuthenticationInput, ForgotInput, ChangePasswordInput } from "./authentication.dto";
import { GqlAuthGuard } from "./authentication.guard";
import { AuthenticationService } from "./authentication.service";

@Resolver(() => User)
export class AuthenticationResolver {
  public constructor(private readonly authService: AuthenticationService, private readonly userService: UserService) {}

  @Mutation(() => User)
  public async login(
    @Args("input") data: AuthenticationInput,
    @Context() ctx: ContextType,
    @MapFields() mapped?: Mapped<User>
  ) {
    return this.authService.login(data, ctx.res, mapped);
  }

  @Mutation(() => User)
  public async register(@Args("input") data: UserInsertInput, @Context() ctx: ContextType) {
    return this.authService.register(data, ctx.res);
  }

  @Mutation(() => String)
  public async forgot(@Args("input") data: ForgotInput) {
    return this.authService.forgot(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  public async changePassword(
    @Args("input") data: ChangePasswordInput,
    @Context() ctx: ContextType,
    @MapFields() mapped?: Mapped<User>
  ) {
    return this.authService.changePassword(ctx.req.user, data, ctx.res, mapped);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  public async profile(@Context() ctx: ContextType, @MapFields() mapped?: Mapped<User>) {
    return this.userService.populate(ctx.req.user, mapped);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  public async evictRefreshCookie(@Context() ctx: ContextType) {
    ctx.res.cookie(REFRESH_TOKEN, "", {
      sameSite: true,
      path: "/",
      httpOnly: true,
      maxAge: 0,
    });

    return true;
  }
}
