import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CityService } from './city/city.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cityService = app.get(CityService);
  await cityService.migrate();

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) =>
        new BadRequestException('Validation failed', {
          cause: errors.map((error) => ({
            field: error.property,
            constraints: error.constraints,
          })),
        }),
    })
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
