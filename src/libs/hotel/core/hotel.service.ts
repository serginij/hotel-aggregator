import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HotelDto } from '../dto/hotel.dto';
import {
  SearchHotelParams,
  TUpdateHotelData,
} from '../interface/hotel.interface';
import { Hotel } from '../model/hotel.model';
import { HotelStore } from '../store/hotel.store';

interface IHotelService {
  create(data: HotelDto): Promise<Hotel | null>;
  findById(id: string): Promise<Hotel | null>;
  findAll(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: string, hotel: TUpdateHotelData): Promise<Hotel | null>;
}

@Injectable()
export class HotelService implements IHotelService {
  constructor(
    @InjectRepository(HotelStore) private readonly hotelStore: HotelStore,
  ) {}

  create = async (hotel: HotelDto) => {
    const res = await this.hotelStore.createHotel(hotel);

    if (!res) return null;

    return res;
  };

  findById = async (id: string) => {
    const hotel = await this.hotelStore.findHotelById(id);

    if (!hotel) return null;

    return hotel;
  };

  findAll = async (params: SearchHotelParams) => {
    const hotels = await this.hotelStore.findAllHotels(params);

    return hotels;
  };

  update = async (id: string, hotel: TUpdateHotelData) => {
    const updatedHotel = await this.hotelStore.updateHotel(id, hotel);

    if (!updatedHotel) return null;

    return updatedHotel;
  };
}
