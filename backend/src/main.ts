import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser'
import {join} from 'path'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config=app.get(ConfigService)
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true
  }));
  const filePath = join(__dirname,'../../','uploads');
console.log(filePath);
  await app.listen(config.get('port') ?? 3000);
}
bootstrap();
