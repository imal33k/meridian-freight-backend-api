import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/index.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number (process.env.PORT) || 3000;

app.enableCors()

  app.useGlobalPipes(new ValidationPipe({whitelist: true}));

  const config = new DocumentBuilder()
    .setTitle('Meridian Freight API')
    .setDescription('The Meridian Freight API description')
    .setVersion('1.0')
    .addTag('meridian-freight')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);

console.log(`Meridian backend running on http://localhost:${port}`);
}

bootstrap();