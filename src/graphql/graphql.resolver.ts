import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Photo } from './photo.entity';
import { TagFilterInput } from './tag-filter.input';
import { PhotoService } from 'src/photo/photo.service';
import { UpdatePhotoTagsInput } from './update-tags.input';

@Resolver()
export class GraphqlResolver {
  constructor(private readonly photoService: PhotoService) {}

  @Query(() => [Photo])
  async photos(
    @Args('userId') userId: string,
    @Args('filter', { nullable: true }) filter?: TagFilterInput,
  ): Promise<Photo[]> {
    return this.photoService.filterPhotos(userId, filter);
  }

  @Mutation(() => Int)
  async deletePhotos(
    @Args({ name: 'keys', type: () => [String] }) ids: string[],
  ): Promise<number> {
    return this.photoService.deletePhotos(ids);
  }

  @Mutation(() => Int)
  async updateTagsForPhotos(
    @Args({ name: 'input', type: () => [UpdatePhotoTagsInput] })
    input: UpdatePhotoTagsInput[],
  ): Promise<number> {
    return this.photoService.updateTagsForPhotos(input);
  }
}
