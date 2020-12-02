import { BullModule } from "@nestjs/bull";
import { Module, Global, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

import { MailQueueConsumer } from "./mail.queue.consumer";

@Global()
@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: "mail",
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>("QUEUE_HOST"),
          port: configService.get<number>("QUEUE_PORT"),
          password: configService.get<string>("QUEUE_PASSWORD"),
        },
      }),
    }),
  ],
  providers: [MailQueueConsumer],
  exports: [BullModule],
})
export class QueueModule implements OnModuleInit {
  public constructor(@InjectPinoLogger(QueueModule.name) private readonly logger: PinoLogger) {}

  public onModuleInit() {
    this.logger.info("QueueModule successfully started");
  }
}
