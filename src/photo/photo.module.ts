import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/repository/repository.module';
import { PhotoService } from './photo.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PhotoController } from './photo.controller';
import { PhotoGateway } from './photo.gateway';

@Module({
  imports: [
    RepositoryModule,
    ClientsModule.register([
      {
        name: 'TEST_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'test_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  providers: [PhotoService, PhotoGateway],
  exports: [PhotoService, PhotoGateway],
  controllers: [PhotoController],
})
export class PhotoModule {}
