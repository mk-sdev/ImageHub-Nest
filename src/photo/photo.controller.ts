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

  @Get('delete')
  async testDelete(@Param(':key') key: string) {
    // await this.R2service.deleteObject('images', 'ip.png');
    await this.photoService.deletePhotos([key])
  }

  @Get('upload')
  async testUpload() {
    // const key = 'ip.png';
    const filePath = path.join(__dirname, './ip.png');
    const fileBuffer = fs.readFileSync(filePath);

    await this.photoService.uploadPhotos([{userId: '123', buffer: fileBuffer}])

    // const result = await this.R2service.uploadToR2({
    //   bucket: 'images',
    //   key,
    //   body: fileBuffer,
    // });

    // return {
    //   message: 'Upload zakończony',
    //   id: result.key,
    //   url: result.url,
    // };
  }

  @MessagePattern({ cmd: 'upload-photos' })
  async handleUploadPhotos(photos: { userId: string; buffer: Buffer }[]) {

    const uploaded: string[] = [];

    for (const file of photos) {
      const key = randomUUID();

      const result = await this.R2service.uploadToR2({
        bucket: 'images',
        key,
        body: file.buffer,
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
  async handleDeletePhotos(ids: string[]): Promise<number> {
    let deletedCount = 0;

    for (const id of ids) {
      const result = await this.repository.deleteOneById(id);
      await this.R2service.deleteObject('images', id);
      if (result.deletedCount > 0) {
        deletedCount++;
        this.photoGateway.sendDeleteLog(deletedCount);
      }
    }

    return deletedCount;
  }
}
