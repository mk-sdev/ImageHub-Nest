import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/repository/repository.module';
import { PhotoService } from './photo.service';

@Module({
  imports: [RepositoryModule],
  providers: [PhotoService],
  exports: [PhotoService],
})
export class PhotoModule {}
