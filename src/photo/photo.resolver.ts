import { Resolver, Query, Args } from '@nestjs/graphql';
import { Photo } from './photo.entity';
import { PhotoService } from './photo.service';
import { TagFilterInput } from './tag-filter.input';

@Resolver(() => Photo)
export class PhotoResolver {
  constructor(private readonly photoService: PhotoService) {}

  @Query(() => [Photo])
  photos(
    @Args('userId') userId: string,
    @Args('filter', { nullable: true }) filter?: TagFilterInput,
  ): Photo[] {
    return this.photoService.filterPhotos(userId, filter);
  }
}
