import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**Configurando un prefijo global */
  app.setGlobalPrefix('api');
  /**Habilitación de los CORS */
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
