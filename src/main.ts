import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { configureSwagger } from './utils/config/configSwagger';
import { configureValidation } from './utils/config/configValidation';
import { ValidationPipe } from '@nestjs/common';

mongoose.set('debug', true);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8080;

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Authorization,Content-Type, Accept',
    credentials: true,
  });

  configureSwagger(app);
  configureValidation(app);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => {
    console.log(
      `Story api service is running on port ${port} | Doc Run on http://localhost:${port}/docs`,
    );
  });
}
bootstrap();
