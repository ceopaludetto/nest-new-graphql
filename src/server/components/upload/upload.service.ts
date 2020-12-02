import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createWriteStream, ensureDir } from "fs-extra";
import path from "path";

import type { FileUpload } from "@/server/utils/common.dto";

@Injectable()
export class UploadService {
  public constructor(private readonly configService: ConfigService) {}

  public async upload({ createReadStream, filename }: FileUpload) {
    const dir = this.configService.get<string>("UPLOADS_PATH", "uploads");
    const filePath = path.resolve(dir, filename);

    return new Promise((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on("finish", () => {
          resolve(path);
        })
        .on("error", reject);
    });
  }

  public async ensure() {
    const dirPath = this.configService.get<string>("UPLOADS_PATH", "uploads");
    return ensureDir(path.resolve(dirPath));
  }
}
