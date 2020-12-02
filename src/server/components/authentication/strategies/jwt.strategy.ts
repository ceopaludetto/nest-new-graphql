import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { AuthenticationError } from "apollo-server-express";
import { Strategy, ExtractJwt, JwtFromRequestFunction } from "passport-jwt";

import { UserService } from "@/server/components/user";
import type { FindByID } from "@/server/utils/common.dto";

import { fromAccessTokenHeader } from "./extractor";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(configService: ConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([fromAccessTokenHeader as JwtFromRequestFunction]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("AUTH_SECRET"),
    });
  }

  public async validate(payload: FindByID) {
    const user = await this.userService.findByID(payload.id);
    if (!user) {
      throw new AuthenticationError("Falha ao encontrar usuário");
    }

    return user;
  }
}
