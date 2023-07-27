import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:0Ukvlm:PTixs@23.22.5.150:5672/smartranking'],
      noAck: false,
      queue: 'admin-backend'
    },
  });

  await app.listen();
}
bootstrap();
