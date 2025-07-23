import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagFilterInput } from 'src/graphql/tag-filter.input';
import { Photo, PhotoDocument } from './photo.schema';

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
  // async deleteManyByIds(ids: string[]): Promise<number> {
  //   const result = await this.photoModel.deleteMany({ _id: { $in: ids } });
  //   return result.deletedCount ?? 0;
  // }
  async savePhoto(data: {
    key: string;
    userId: string;
    tags?: string[];
  }): Promise<Photo> {
    const createdPhoto = new this.photoModel({
      key: data.key,
      userId: data.userId,
      tags: data.tags || [],
    });
    return createdPhoto.save();
  }

  async deleteOneByKey(key: string): Promise<{ deletedCount: number }> {
    return this.photoModel.deleteOne({ key });
  }

  // aktualizuje tagi w wielu rekordach
  // async updateManyTags(
  //   updates: { id: string; tags: string[] }[],
  //   onProgress?: (count: number) => void,
  // ): Promise<number> {
  //   let updatedCount = 0;

  //   for (const [, item] of updates.entries()) {
  //     const result = await this.photoModel.updateOne(
  //       { _id: item.id },
  //       { $set: { tags: item.tags } },
  //     );

  //     if (result.modifiedCount > 0) {
  //       updatedCount++;
  //     }

  //     // Emituj postęp
  //     onProgress?.(updatedCount);
  //   }

  //   return updatedCount;
  // }

  async updateOne(id: string, tags: string[]) {
    return this.photoModel.updateOne({ _id: id }, { $set: { tags } });
  }
}
