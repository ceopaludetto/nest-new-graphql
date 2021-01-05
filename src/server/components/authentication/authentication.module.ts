import { Module, OnModuleInit, Global } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";

import { UserModule } from "@/server/components/user";

import { AuthenticationResolver } from "./authentication.resolver";
import { AuthenticationService } from "./authentication.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Global()
@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("AUTH_SECRET"),
        signOptions: { expiresIn: "1h" },
      }),
    }),
  ],
  providers: [AuthenticationService, AuthenticationResolver, JwtStrategy],
  exports: [AuthenticationService, PassportModule],
})
export class AuthenticationModule implements OnModuleInit {
  public constructor(@InjectPinoLogger(AuthenticationModule.name) private readonly logger: PinoLogger) {}

  public onModuleInit() {
    this.logger.info(`AuthenticationModule successfully started`);
  }
}
