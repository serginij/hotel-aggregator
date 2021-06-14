import { InjectRepository } from '@nestjs/typeorm';
import { HotelRoomDto } from '../dto/hotel-room.dto';
import {
  SearchHotelRoomParams,
  TUpdateHotelRoomData,
} from '../interface/hotel-room.interface';
import { HotelRoom } from '../model/hotel-room.model';
import { HotelRoomStore } from '../store/hotel-room.store';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HotelService } from './hotel.service';

interface IHotelRoomService {
  create(data: HotelRoomDto): Promise<HotelRoom | null>;
  findById(id: string): Promise<HotelRoom | null>;
  findAll(params: SearchHotelRoomParams): Promise<HotelRoom[]>;
  update(id: string, data: TUpdateHotelRoomData): Promise<HotelRoom | null>;
}

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(
    @InjectRepository(HotelRoomStore)
    private readonly hotelRoomStore: HotelRoomStore,
    private readonly hotelService: HotelService,
  ) {}

  create = async (hotelRoom: HotelRoomDto) => {
    const hotel = await this.hotelService.findById(hotelRoom.hotel);
    if (!hotel) throw new BadRequestException('Invalid hotel id');

    const res = await this.hotelRoomStore.createHotelRoom({
      ...hotelRoom,
      hotel,
    });

    if (!res) return null;

    return res;
  };

  findById = async (id: string) => {
    const hotelRoom = await this.hotelRoomStore.findHotelRoomById(id);

    if (!hotelRoom) return null;

    return hotelRoom;
  };

  update = async (id: string, hotel: TUpdateHotelRoomData) => {
    const updatedRoom = await this.hotelRoomStore.updateHotelRoom(id, hotel);

    if (!updatedRoom) return null;

    return updatedRoom;
  };

  findAll = async (params: SearchHotelRoomParams) => {
    const hotelRooms = await this.hotelRoomStore.findAllHotelRooms(params);

    return hotelRooms;
  };
}
