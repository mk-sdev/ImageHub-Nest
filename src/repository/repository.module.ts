import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchema } from './photo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
  ],
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class RepositoryModule {}
