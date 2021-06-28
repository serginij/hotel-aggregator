import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());

  const logger = new Logger('Bootstrap');

  await app.listen(process.env.PORT || 3000, () => {
    logger.log(
      `Server started in ENV: ${
        process.env.NODE_ENV?.toUpperCase() || 'development'
      } | PORT: ${process.env.PORT ?? 3000}`,
    );
  });
}

bootstrap();
