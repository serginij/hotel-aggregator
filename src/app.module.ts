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
import { ConfigModule } from '@nestjs/config';

@Injectable()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    TypeOrmModule.forRoot(),
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
