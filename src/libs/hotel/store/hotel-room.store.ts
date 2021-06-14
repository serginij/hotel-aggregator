import { EntityRepository, Like, Repository } from 'typeorm';

import { HotelRoom } from '../model/hotel-room.model';

import {
  SearchHotelRoomParams,
  TCreateHotelRoomData,
  TUpdateHotelRoomData,
} from '../interface/hotel-room.interface';

interface IHotelRoomStore {
  createHotelRoom: (
    hotelRoomDto: TCreateHotelRoomData,
  ) => Promise<HotelRoom | undefined>;

  findHotelRoomById: (id: string) => Promise<HotelRoom | undefined>;
  findAllHotelRooms: (
    params: SearchHotelRoomParams,
  ) => Promise<HotelRoom[] | undefined>;
  updateHotelRoom: (
    id: string,
    hotelRoomDto: TUpdateHotelRoomData,
  ) => Promise<HotelRoom>;
}

@EntityRepository(HotelRoom)
export class HotelRoomStore
  extends Repository<HotelRoom>
  implements IHotelRoomStore
{
  createHotelRoom = async (hotelRoomDto: TCreateHotelRoomData) => {
    const hotelRoom = HotelRoom.create(hotelRoomDto);

    return await hotelRoom.save();
  };

  updateHotelRoom = async (id: string, hotelRoomDto: TUpdateHotelRoomData) => {
    const hotelRoom = await HotelRoom.update(id, hotelRoomDto);

    return hotelRoom.raw;
  };

  findHotelRoomById = async (id: string) => {
    return await HotelRoom.findOne(id);
  };

  findAllHotelRooms = async (params: SearchHotelRoomParams) => {
    const { limit, offset, title, isEnabled } = params;

    return await HotelRoom.find({
      skip: offset,
      take: limit,
      where: {
        title: Like(title),
        isEnabled: Like(isEnabled),
      },
    });
  };
}
