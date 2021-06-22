import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from 'src/utils/utils.module';
import { HotelModule } from '../hotel/hotel.module';
import { ReservationController } from './controller/reservation.controller';
import { ReservationService } from './core/reservation.service';
import { Reservation } from './model/reservation.model';
import { ReservationStore } from './store/reservation.store';

@Module({
  imports: [
    HotelModule,
    PassportModule,
    UtilsModule,
    TypeOrmModule.forFeature([Reservation, ReservationStore]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationStore],
  exports: [ReservationService],
})
export class ReservationModule {}
