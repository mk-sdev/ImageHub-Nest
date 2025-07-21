import { Args, Query, Resolver } from '@nestjs/graphql';
import { Photo } from './photo.entity';
import { TagFilterInput } from './tag-filter.input';
import { PhotoService } from 'src/photo/photo.service';

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
}
