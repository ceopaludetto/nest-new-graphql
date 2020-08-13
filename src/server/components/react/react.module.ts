import { Module, OnModuleInit } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

import { ReactController } from "./react.controller";
import { ReactService } from "./react.service";
import { StatsProvider } from "./react.stats.provider";

@Module({
  controllers: [ReactController],
  providers: [StatsProvider, ReactService],
})
export class ReactModule implements OnModuleInit {
  public constructor(@InjectPinoLogger(ReactModule.name) private readonly logger: PinoLogger) {}

  public onModuleInit() {
    this.logger.info("ReactModule successfully started");
  }
}
