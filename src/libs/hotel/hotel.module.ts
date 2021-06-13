import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from 'src/utils/utils.module';
import { HotelController } from './controller/hotel.controller';
import { HotelService } from './core/hotel.service';
import { Hotel } from './model/hotel.model';
import { HotelStore } from './store/hotel.store';

@Module({
  imports: [
    PassportModule,
    UtilsModule,
    TypeOrmModule.forFeature([Hotel, HotelStore]),
  ],
  controllers: [HotelController],
  providers: [HotelService, HotelStore],
  exports: [HotelService],
})
export class HotelModule {}
