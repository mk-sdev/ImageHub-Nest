import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchema } from './photo.schema';
import { PhotoService } from './photo.service';
import { PhotoResolver } from './photo.resolver';
import { PhotoRepository } from './photo.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
  ],
  providers: [PhotoService, PhotoResolver, PhotoRepository],
})
export class PhotoModule {}
