import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TypedConfigService } from './common/services/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(TypedConfigService);
  const appConfig = configService.getAppConfig();

  // Global prefix
  app.setGlobalPrefix(appConfig.apiPrefix);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: appConfig.cors.origin,
    credentials: true,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle(appConfig.swagger.title)
    .setDescription(appConfig.swagger.description)
    .setVersion(appConfig.swagger.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(appConfig.swagger.path, app, document);

  await app.listen(appConfig.port);

  console.log(
    `🚀 Application is running on: http://localhost:${appConfig.port}`,
  );
  console.log(
    `📚 Swagger documentation: http://localhost:${appConfig.port}/${appConfig.swagger.path}`,
  );
}
bootstrap();
