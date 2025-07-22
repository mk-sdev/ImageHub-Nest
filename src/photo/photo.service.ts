import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RepositoryService } from 'src/repository/repository.service';
import { Photo as PhotoEntity } from '../graphql/photo.entity';
import { TagFilterInput } from '../graphql/tag-filter.input';
import { PhotoDocument } from '../repository/photo.schema';
import { sendWithTimeout } from './broker.helper';
@Injectable()
export class PhotoService {
  constructor(
    @Inject('TEST_SERVICE')
    private readonly client: ClientProxy,
    private readonly repository: RepositoryService,
  ) {}

  async filterPhotos(
    userId: string,
    filter?: TagFilterInput,
  ): Promise<PhotoEntity[]> {
    const photos = await this.repository.findByUserIdAndFilter(userId, filter);

    return photos.map((photo) => this.toGraphQL(photo));
  }

  private toGraphQL(photo: PhotoDocument): PhotoEntity {
    return {
      id: String(photo._id),
      url: photo.url,
      userId: photo.userId,
      tags: photo.tags,
    };
  }

  async updateTagsForPhotos(
    updates: { id: string; tags: string[] }[],
  ): Promise<number> {
    const result = await sendWithTimeout<number>(
      this.client,
      { cmd: 'update-tags' },
      updates,
      'number',
    );

    return result;
  }

  async deletePhotos(ids: string[]): Promise<number> {
    return sendWithTimeout<number>(
      this.client,
      { cmd: 'delete-photos' },
      ids,
      'number',
    );
  }
}
