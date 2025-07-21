import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchema } from './photo.schema';
import { PhotoService } from './photo.service';
import { PhotoResolver } from './photo.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
  ],
  providers: [PhotoResolver, PhotoService],
})
export class PhotoModule {}
