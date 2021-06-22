import { EntityRepository, Repository } from 'typeorm';

import { Hotel } from '../model/hotel.model';

import {
  SearchHotelParams,
  TCreateHotelData,
  TUpdateHotelData,
} from '../interface/hotel.interface';
import { ID } from 'src/common/common.types';

interface IHotelStore {
  createHotel: (hotel: TCreateHotelData) => Promise<Hotel | undefined>;
  updateHotel: (
    id: ID,
    hotelDto: TUpdateHotelData,
  ) => Promise<Hotel | undefined>;
  findHotelById: (id: ID) => Promise<Hotel | undefined>;
  findAllHotels: (params: SearchHotelParams) => Promise<Hotel[] | undefined>;
}

@EntityRepository(Hotel)
export class HotelStore extends Repository<Hotel> implements IHotelStore {
  createHotel = async (hotelDto: TCreateHotelData) => {
    const hotel = Hotel.create(hotelDto);

    return await hotel.save();
  };

  findHotelById = async (id: ID) => {
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

  updateHotel = async (id: ID, hotelDto: TUpdateHotelData) => {
    const hotelRoom = await Hotel.update(id, hotelDto);

    return hotelRoom.raw;
  };
}
