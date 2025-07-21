import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Photo, PhotoDocument } from './photo.schema';
import { TagFilterInput } from 'src/graphql/tag-filter.input';
import { NotFoundException } from '@nestjs/common';

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

  // usuwa wiele rekordów na raz
  async deleteManyByIds(ids: string[]): Promise<number> {
    const result = await this.photoModel.deleteMany({ _id: { $in: ids } });
    return result.deletedCount ?? 0;
  }

  // aktualizuje tagi w wielu rekordach
  async updateManyTags(
    updates: { id: string; tags: string[] }[],
  ): Promise<number> {
    const bulkOps = updates.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { tags: item.tags } },
      },
    }));

    const result = await this.photoModel.bulkWrite(bulkOps);
    return result.modifiedCount ?? 0;
  }
}
