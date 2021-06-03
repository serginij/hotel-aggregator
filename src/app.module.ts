import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './libs/user/user.module';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_POST || 27019;
const DB_USER = process.env.DB_USER || 'user';
const DB_PASS = process.env.DB_PASS || 'qwerty';
const DB_NAME = process.env.DB_NAME || 'aggregator';
const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: DB_HOST,
      port: DB_PORT as number,
      username: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      entities: [],
      synchronize: !isProduction,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
