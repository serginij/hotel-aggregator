import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from 'src/utils/utils.module';
import { HotelRoomController } from './controller/hotel-room.controller';
import { HotelController } from './controller/hotel.controller';
import { HotelRoomService } from './core/hotel-room.service';
import { HotelService } from './core/hotel.service';
import { Hotel } from './model/hotel.model';
import { HotelRoomStore } from './store/hotel-room.store';
import { HotelStore } from './store/hotel.store';

@Module({
  imports: [
    MulterModule.register({ dest: 'public/images' }),
    PassportModule,
    UtilsModule,
    TypeOrmModule.forFeature([Hotel, HotelStore]),
  ],
  controllers: [HotelController, HotelRoomController],
  providers: [HotelService, HotelStore, HotelRoomService, HotelRoomStore],
  exports: [HotelService, HotelRoomService],
})
export class HotelModule {}
