import { Module, OnModuleInit } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

import { SchemaService } from "./schema.service";

@Module({
  providers: [SchemaService],
  exports: [SchemaService],
})
export class SchemaModule implements OnModuleInit {
  public constructor(@InjectPinoLogger(SchemaModule.name) private readonly logger: PinoLogger) {}

  public onModuleInit() {
    this.logger.info(`SchemaModule successfully started`);
  }
}
