import { Module, OnModuleInit } from "@nestjs/common";

import { UploadService } from "./upload.service";

@Module({
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule implements OnModuleInit {
  public constructor(private readonly uploadService: UploadService) {}

  public async onModuleInit() {
    return this.uploadService.ensure();
  }
}
