import { Module, OnModuleInit } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

import { AuthenticationModule } from "@/server/components/authentication";

import { ReactController } from "./react.controller";
import { ReactRenderService } from "./react.render.service";
import { ReactService } from "./react.service";

@Module({
  imports: [AuthenticationModule],
  controllers: [ReactController],
  providers: [ReactService, ReactRenderService],
})
export class ReactModule implements OnModuleInit {
  public constructor(@InjectPinoLogger(ReactModule.name) private readonly logger: PinoLogger) {}

  public onModuleInit() {
    this.logger.info("ReactModule successfully started");
  }
}
