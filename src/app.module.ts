import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './libs/user/user.module';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './libs/auth/auth.module';
import 'reflect-metadata';
import { HotelModule } from './libs/hotel/hotel.module';
import { ReservationModule } from './libs/reservation/reservation.module';
import { SupportModule } from './libs/support/support.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        host: configService.get('MONGO_HOST', 'localhost'),
        port: configService.get<number>('MONGO_PORT', 27017),
        username: configService.get('MONGO_USERNAME', 'user'),
        password: configService.get('MONGO_PASSWORD', 'password'),
        database: configService.get('MONGO_DB', 'db'),
        entities: JSON.parse(configService.get<string>('TYPEORM_ENTITIES', '')),
        subscribers: JSON.parse(
          configService.get<string>('TYPEORM_SUBSCRIBERS', ''),
        ),
        migrations: JSON.parse(
          configService.get<string>('TYPEORM_MIGRATIONS', ''),
        ),
        synchronize: configService.get('TYPEORM_SYNCHRONIZE'),
        extra: JSON.parse(configService.get('TYPEORM_DRIVER_EXTRA', '')),
        url: configService.get('TYPEORM_URL'),
      }),
    }),
    UtilsModule,
    AuthModule,
    HotelModule,
    ReservationModule,
    SupportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
