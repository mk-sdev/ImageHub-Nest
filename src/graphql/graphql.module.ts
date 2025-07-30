import { Module } from '@nestjs/common';
import { PhotoModule } from 'src/photo/photo.module';
import { GraphqlResolver } from './graphql.resolver';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PhotoModule, AuthModule],
  providers: [GraphqlResolver],
})
export class GraphqlModule {}
