import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createWriteStream, ensureDir } from "fs-extra";
import path from "path";
import sharp from "sharp";
import shortid from "shortid";

import type { FileUpload } from "@/server/utils/common.dto";

@Injectable()
export class UploadService {
  public constructor(private readonly configService: ConfigService) {}

  public async upload({ createReadStream }: FileUpload) {
    const dir = this.configService.get<string>("UPLOADS_PATH", "uploads");
    const file = `${shortid.generate()}.webp`;
    const filePath = path.resolve(dir, file);

    return new Promise<string>((resolve, reject) => {
      createReadStream()
        .pipe(sharp().webp())
        .pipe(createWriteStream(filePath))
        .on("finish", () => {
          resolve(file);
        })
        .on("error", reject);
    });
  }

  public async ensure() {
    const dirPath = this.configService.get<string>("UPLOADS_PATH", "uploads");
    return ensureDir(path.resolve(dirPath));
  }
}
