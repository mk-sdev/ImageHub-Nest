import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PhotoModule } from './photo/photo.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphqlModule } from './graphql/graphql.module';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/imagehub'),
    PhotoModule,
    GraphqlModule,
    RepositoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
