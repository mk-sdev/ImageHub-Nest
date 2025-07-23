import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import * as mime from 'mime-types';

@Injectable()
export class R2Service {
  private readonly client: S3Client;
  private readonly logger = new Logger(R2Service.name);

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  async deleteObject(bucket: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      await this.client.send(command);
      this.logger.log(`✅ Usunięto plik z R2: ${key}`);
    } catch (error) {
      this.logger.error(`❌ Błąd przy usuwaniu: ${key}`, error);
      throw error;
    }
  }

  async uploadToR2(params: {
    bucket: string;
    key: string; // to powinno być generowanie w tej funkcji, a nie przyjmowane jako argument
    body: Buffer | Readable;
    contentType?: string;
  }): Promise<{ key: string; url: string }> {
    const contentType =
      params.contentType ||
      (typeof mime.lookup(params.key) === 'string'
        ? (mime.lookup(params.key) as string)
        : 'application/octet-stream');

    const command = new PutObjectCommand({
      Bucket: params.bucket,
      Key: params.key,
      Body: params.body,
      ContentType: contentType,
    });

    try {
      await this.client.send(command);
      const url = `${process.env.R2_BASE_URL}/${params.key}`;
      this.logger.log(`✅ Przesłano do R2: ${url}`);
      return { key: params.key, url };
    } catch (error) {
      this.logger.error(`❌ Błąd przesyłania do R2: ${error}`);
      throw error;
    }
  }
}
