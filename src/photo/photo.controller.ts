import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RepositoryService } from 'src/repository/repository.service';
import { PhotoGateway } from './photo.gateway';

@Controller('photo') //* RabbitMQ consumers
export class PhotoController {
  constructor(
    private readonly repository: RepositoryService,
    private readonly photoGateway: PhotoGateway,
  ) {}

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
      if (result.deletedCount > 0) {
        deletedCount++;
        this.photoGateway.sendDeleteLog(deletedCount);
      }
    }

    return deletedCount;
  }
}
