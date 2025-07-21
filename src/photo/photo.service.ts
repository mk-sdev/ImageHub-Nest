import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Photo, PhotoDocument } from './photo.schema';
import { TagFilterInput } from './tag-filter.input';
import { Photo as PhotoEntity } from './photo.entity'; // GraphQL

@Injectable()
export class PhotoService {
  constructor(
    @InjectModel(Photo.name) private photoModel: Model<PhotoDocument>,
  ) {}

  async filterPhotos(
    userId: string,
    filter?: TagFilterInput,
  ): Promise<PhotoEntity[]> {
    const mongoFilter = this.buildMongoFilter(filter);
    const photos = await this.photoModel
      .find({ userId, ...mongoFilter })
      .exec();

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

  private buildMongoFilter(filter?: TagFilterInput): any {
    if (!filter) return {};

    if (filter.tag) {
      return { tags: filter.tag };
    }

    if (filter.and) {
      return {
        $and: filter.and.map((f) => this.buildMongoFilter(f)),
      };
    }

    if (filter.or) {
      return {
        $or: filter.or.map((f) => this.buildMongoFilter(f)),
      };
    }

    if (filter.not) {
      return {
        $nor: [this.buildMongoFilter(filter.not)],
      };
    }

    return {};
  }
}
