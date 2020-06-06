import { Module, Global } from "@nestjs/common";
// import { PinoLogger } from "nestjs-pino";
import { resolve } from "path";

import { ConfigurationService } from "./configuration.service";

@Global()
@Module({
  providers: [
    {
      provide: ConfigurationService,
      // inject: [PinoLogger],
      useFactory: () =>
        new ConfigurationService(
          resolve(
            process.env.BASE_DIR as string,
            "env",
            `config.${(process.env.DEPLOYMENT as string) || "development"}.yml`
          )
          // logger
        ),
    },
  ],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
