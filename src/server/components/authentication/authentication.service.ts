import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserInputError, AuthenticationError } from "apollo-server-express";
import { hash } from "bcryptjs";
import type { Queue } from "bull";
import type { Response } from "express";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { URL } from "url";

import { UserInsertInput, UserService } from "@/server/components/user";
import type { User } from "@/server/models";
import type { Mapped } from "@/server/utils/common.dto";

import type { AuthenticationInput, ForgotInput } from "./authentication.dto";

@Injectable()
export class AuthenticationService {
  public constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectQueue("mail") private readonly mailQueue: Queue,
    @InjectPinoLogger(AuthenticationService.name) private readonly logger: PinoLogger
  ) {}

  private generate(user: User) {
    return this.jwtService.sign({ id: user.id }, { expiresIn: "1h" });
  }

  public async login({ login, password }: AuthenticationInput, res: Response, mapped?: Mapped<User>) {
    try {
      const user = await this.userService.findByLogin(login, mapped);
      if (!user) {
        throw new UserInputError("Usuário não encontrado", { fields: ["login"] });
      }

      if (!(await user.comparePasswords(password))) {
        throw new UserInputError("Senha incorreta", { fields: ["password"] });
      }

      res.cookie("auth", `Bearer ${this.generate(user)}`, {
        sameSite: true,
        httpOnly: true,
      });

      return user;
    } catch (error) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new AuthenticationError("Falha ao fazer login");
    }
  }

  public async register(data: UserInsertInput, res: Response) {
    try {
      data.password = await hash(data.password, 10);
      let user = await this.userService.create(data);

      user = await this.userService.populate(user, ["person"]);

      await this.mailQueue.add("register", user, {
        attempts: 5,
        backoff: {
          type: "fixed",
          delay: 2000,
        },
      });

      res.cookie("auth", `Bearer ${this.generate(user)}`, {
        sameSite: true,
        httpOnly: true,
      });

      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async forgot(data: ForgotInput) {
    try {
      const user = await this.userService.findByLogin(data.login, ["person"]);
      const callback = new URL(data.callback);

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const token = this.generate(user);
      callback.search = `?t=${token}`;

      // set recover token in database
      await this.userService.setRecoverToken(user, token);

      await this.mailQueue.add(
        "forgot",
        { user, callback: callback.toString() },
        {
          attempts: 5,
          backoff: {
            type: "fixed",
            delay: 2000,
          },
        }
      );

      return user.person.email;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  // implement recover
}
