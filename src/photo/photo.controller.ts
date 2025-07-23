import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RepositoryService } from 'src/repository/repository.service';
import { PhotoGateway } from './photo.gateway';
import { PhotoService } from './photo.service';
import { R2Service } from './R2.service';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

@Controller('photo') //* RabbitMQ consumers
export class PhotoController {
  constructor(
    private readonly repository: RepositoryService,
    private readonly photoGateway: PhotoGateway,
    private readonly R2service: R2Service,
    private readonly photoService: PhotoService,
  ) {}

  @Get('delete/:key')
  async testDelete(@Param('key') key: string) {
    try {
      const result = await this.photoService.deletePhotos([key]);
      return { deleted: result };
    } catch (error) {
      console.error('❌ Błąd przy usuwaniu zdjęcia:', error);
      throw error; // Można też zwrócić { error: error.message }
    }
  }

  @Get('upload')
  async testUpload() {
    const key = 'ip.png';
    const filePath = path.join(__dirname, './ip.png');
    const fileBuffer = fs.readFileSync(filePath);
    await this.photoService.uploadPhotos([
      { userId: '123', buffer: fileBuffer },
    ]);

    const result = await this.R2service.uploadToR2({
      bucket: 'images',
      key,
      body: fileBuffer,
    });

    return {
      message: 'Upload zakończony',
      id: result.key,
      url: result.url,
    };
  }

  @MessagePattern({ cmd: 'upload-photos' })
  async handleUploadPhotos(photos: { userId: string; buffer: string }[]) {
    const uploaded: string[] = [];

    try {
      for (const file of photos) {
        const buffer = Buffer.from(file.buffer, 'base64'); // deserializacja

        const key = randomUUID();

        const result = await this.R2service.uploadToR2({
          bucket: 'images',
          key,
          body: buffer,
        });

        await this.repository.savePhoto({
          key: result.key,
          userId: file.userId,
          tags: [],
        });

        this.photoGateway.sendUploadLog(1);
        uploaded.push(result.key);
      }

      return {
        message: `${uploaded.length} files uploaded and saved.`,
        files: uploaded,
      };
    } catch (err) {
      console.error('❌ Błąd podczas uploadu zdjęcia:', err);
      throw err;
    }
  }

  @MessagePattern({ cmd: 'update-tags' })
  async handleUpdateTags(
    updates: { id: string; tags: string[] }[],
  ): Promise<number> {
    let updatedCount = 0;

    for (const update of updates) {
      // TODO: zapisywać blokowo, a nie pojedynczo, żeby nie przeciążać bazy
      const result = await this.repository.updateOne(update.id, update.tags);
      if (result.modifiedCount > 0) {
        updatedCount++;
        this.photoGateway.sendUpdateLog(1);
      }
    }

    return updatedCount;
  }

  @MessagePattern({ cmd: 'delete-photos' })
  async handleDeletePhotos(keys: string[]): Promise<number> {
    let deletedCount = 0;

    for (const key of keys) {
      try {
        const result = await this.repository.deleteOneByKey(key);

        await this.R2service.deleteObject('images', key);

        if (result?.deletedCount > 0) {
          deletedCount++;
          this.photoGateway.sendDeleteLog(deletedCount);
        }
      } catch (err) {
        console.error(`❌ Błąd przy usuwaniu ${key}:`, err); // <=== TO NAS INTERESUJE
        throw err; // pozwala zwrócić błąd do `sendWithTimeout`
      }
    }

    return deletedCount;
  }
}
