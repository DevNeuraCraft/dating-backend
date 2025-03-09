import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const environment = process.env.ENVIRONMENT;
  if (environment === 'prod') {
    app.enableCors({
      origin: 'https://vuzcrmplus.store',
      methods: 'GET,POST,PUT,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true,
    });
  } else {
    app.enableCors();
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
