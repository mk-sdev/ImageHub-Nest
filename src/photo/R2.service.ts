import { Injectable, Logger } from '@nestjs/common';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

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
}
