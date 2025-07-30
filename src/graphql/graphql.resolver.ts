import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlGuard } from 'src/auth/gql.guard';
import { PhotoService } from 'src/photo/photo.service';
import { Photo } from './photo.entity';
import { TagFilterInput } from './tag-filter.input';
import { UpdatePhotoTagsInput } from './update-tags.input';
import { Id } from 'src/id.decorator';

@Resolver()
export class GraphqlResolver {
  constructor(private readonly photoService: PhotoService) {}

  @Query(() => [Photo])
  @UseGuards(GqlGuard)
  async photos(
    @Id() userId: string,
    @Args('filter', { nullable: true }) filter?: TagFilterInput,
  ): Promise<Photo[]> {
    return this.photoService.filterPhotos(userId, filter);
  }

  @Mutation(() => Int)
  @UseGuards(GqlGuard)
  async deletePhotos(
    @Args({ name: 'keys', type: () => [String] }) ids: string[],
  ): Promise<number> {
    return this.photoService.deletePhotos(ids);
  }

  @Mutation(() => Int)
  @UseGuards(GqlGuard)
  async updateTagsForPhotos(
    @Args({ name: 'input', type: () => [UpdatePhotoTagsInput] })
    input: UpdatePhotoTagsInput[],
  ): Promise<number> {
    return this.photoService.updateTagsForPhotos(input);
  }
}
