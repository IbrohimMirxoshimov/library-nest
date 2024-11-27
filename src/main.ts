import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { MainValidationPipe } from './common/pipes/main-validation.pipe';
import { app_config } from './config/app.config';
import { PrismaErrorFilter } from './prisma/prisma.error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [/http:\/\/localhost:\d+/],
    },
  });

  app.getHttpAdapter().getInstance().set('trust proxy', true);
  app.enableShutdownHooks();
  app.setGlobalPrefix(app_config.api_prefix, {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(MainValidationPipe);
  app.useGlobalFilters(new PrismaErrorFilter());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('lbdocs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(app_config.port);
}

bootstrap();
