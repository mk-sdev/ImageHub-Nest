import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RepositoryService } from 'src/repository/repository.service';

@Controller('photo') //* RabbitMQ consumers
export class PhotoController {
  constructor(private readonly repository: RepositoryService) {}

  @MessagePattern({ cmd: 'update-tags' })
  async handleUpdateTags(
    updates: { id: string; tags: string[] }[],
  ): Promise<number> {
    return this.repository.updateManyTags(updates);
  }

  @MessagePattern({ cmd: 'delete-photos' })
  async handleDeletePhotos(ids: string[]): Promise<number> {
    return this.repository.deleteManyByIds(ids);
  }
}
