import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/error.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api/afisha');

  const configService = app.get(ConfigService);

  const corsOrigin = configService
    .getOrThrow<string>('CORS_ORIGIN')
    ?.split(',');

  const corsMethods = configService
    .getOrThrow<string>('CORS_METHODS')
    ?.split(',');

  const corsCredentials =
    configService.get<boolean>('CORS_CREDENTIALS') ?? false;

  app.enableCors({
    origin: corsOrigin,
    methods: corsMethods,
    credentials: corsCredentials,
  });
  app.useStaticAssets(join(process.cwd(), 'public'));
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = configService.getOrThrow<number>('APP_PORT');

  await app.listen(port);
}
bootstrap();
