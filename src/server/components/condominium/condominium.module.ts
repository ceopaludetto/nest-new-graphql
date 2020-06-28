import { Module, OnModuleInit } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

import { Condominium } from "@/server/models";

import { CondominiumResolver } from "./condominium.resolver";
import { CondominiumService } from "./condominium.service";

@Module({
  imports: [SequelizeModule.forFeature([Condominium])],
  providers: [CondominiumResolver, CondominiumService],
  exports: [CondominiumService],
})
export class CondominiumModule implements OnModuleInit {
  public constructor(@InjectPinoLogger(CondominiumModule.name) private readonly logger: PinoLogger) {}

  public onModuleInit() {
    this.logger.info(`CondominiumModule successfully started`);
  }
}