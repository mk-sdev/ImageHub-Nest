import { Injectable } from '@nestjs/common';
import { RepositoryService } from 'src/repository/repository.service';
import { Photo as PhotoEntity } from '../graphql/photo.entity';
import { TagFilterInput } from '../graphql/tag-filter.input';
import { PhotoDocument } from '../repository/photo.schema';
@Injectable()
export class PhotoService {
  constructor(private readonly repository: RepositoryService) {}

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
}
