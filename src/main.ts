import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_URL!],
      queue: 'test_queue',
      queueOptions: { durable: false },
    },
  });
  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 2137);
}
bootstrap();
