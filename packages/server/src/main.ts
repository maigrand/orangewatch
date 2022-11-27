import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    //@TODO: fastify register
    const app = await NestFactory.create(AppModule);
    await app.listen(8080);
}
bootstrap();
