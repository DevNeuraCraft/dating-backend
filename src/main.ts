import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const environment = process.env.ENVIRONMENT;
  // Условие для настройки CORS
  if (environment === 'prod') {
    app.enableCors({
      origin: 'https://vuzcrmplus.store',
      methods: 'GET,POST,PUT,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true,
    });
  } else {
    app.enableCors(); // Для других сред (например, разработки) включаем все по умолчанию
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();