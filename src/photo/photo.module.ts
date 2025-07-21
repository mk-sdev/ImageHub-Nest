import { Module } from '@nestjs/common';
import { PhotoResolver } from './photo.resolver';
import { PhotoService } from './photo.service';

@Module({
  providers: [PhotoResolver, PhotoService],
})
export class PhotoModule {}
