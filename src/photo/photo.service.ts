import { Injectable } from '@nestjs/common';
import { PhotoRepository } from './photo.repository';
import { Photo as PhotoEntity } from './photo.entity';
import { TagFilterInput } from './tag-filter.input';
import { PhotoDocument } from './photo.schema';
@Injectable()
export class PhotoService {
  constructor(private readonly photoRepository: PhotoRepository) {}

  async filterPhotos(
    userId: string,
    filter?: TagFilterInput,
  ): Promise<PhotoEntity[]> {
    const photos = await this.photoRepository.findByUserIdAndFilter(
      userId,
      filter,
    );

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
