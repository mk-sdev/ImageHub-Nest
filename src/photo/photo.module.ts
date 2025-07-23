import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/repository/repository.module';
import { PhotoService } from './photo.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PhotoController } from './photo.controller';
import { PhotoGateway } from './photo.gateway';
import { R2Service } from './R2.service';

@Module({
  imports: [
    RepositoryModule,
    ClientsModule.register([
      {
        name: 'TEST_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.AMQP_URL!],
          queue: 'test_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  providers: [PhotoService, PhotoGateway, R2Service],
  exports: [PhotoService, PhotoGateway, R2Service],
  controllers: [PhotoController],
})
export class PhotoModule {}
