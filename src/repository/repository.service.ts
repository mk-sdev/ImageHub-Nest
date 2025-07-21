import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Photo, PhotoDocument } from './photo.schema';
import { TagFilterInput } from 'src/graphql/tag-filter.input';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectModel(Photo.name) private photoModel: Model<PhotoDocument>,
  ) {}

  async findByUserIdAndFilter(
    userId: string,
    filter?: TagFilterInput,
  ): Promise<PhotoDocument[]> {
    const mongoFilter = this.buildMongoFilter(filter);
    return this.photoModel.find({ userId, ...mongoFilter }).exec();
  }

  private buildMongoFilter(filter?: TagFilterInput): any {
    if (!filter) return {};

    if (filter.tag) {
      return { tags: filter.tag };
    }

    if (filter.and) {
      return { $and: filter.and.map((f) => this.buildMongoFilter(f)) };
    }

    if (filter.or) {
      return { $or: filter.or.map((f) => this.buildMongoFilter(f)) };
    }

    if (filter.not) {
      return { $nor: [this.buildMongoFilter(filter.not)] };
    }

    return {};
  }
}
