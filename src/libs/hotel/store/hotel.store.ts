import { EntityRepository, Repository } from 'typeorm';

import { Hotel } from '../model/hotel.model';

import {
  SearchHotelParams,
  TCreateHotelData,
  TUpdateHotelData,
} from '../interface/hotel.interface';

interface IHotelStore {
  createHotel: (hotel: TCreateHotelData) => Promise<Hotel | undefined>;
  updateHotel: (
    id: string,
    hotelDto: TUpdateHotelData,
  ) => Promise<Hotel | undefined>;
  findHotelById: (id: string) => Promise<Hotel | undefined>;
  findAllHotels: (params: SearchHotelParams) => Promise<Hotel[] | undefined>;
}

@EntityRepository(Hotel)
export class HotelStore extends Repository<Hotel> implements IHotelStore {
  createHotel = async (hotelDto: TCreateHotelData) => {
    const hotel = Hotel.create(hotelDto);

    return await hotel.save();
  };

  findHotelById = async (id: string) => {
    return await Hotel.findOne(id);
  };

  findAllHotels = async (params: SearchHotelParams) => {
    const { limit, offset, title } = params;

    return await Hotel.find({
      skip: offset,
      take: limit,
      where: {
        title: new RegExp(title),
      },
    });
  };

  updateHotel = async (id: string, hotelDto: TUpdateHotelData) => {
    const hotelRoom = await Hotel.update(id, hotelDto);

    return hotelRoom.raw;
  };
}
