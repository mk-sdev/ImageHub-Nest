import { Module } from '@nestjs/common';
import { PhotoModule } from 'src/photo/photo.module';
import { GraphqlResolver } from './graphql.resolver';

@Module({
  imports: [PhotoModule],
  providers: [GraphqlResolver],
})
export class GraphqlModule {}
