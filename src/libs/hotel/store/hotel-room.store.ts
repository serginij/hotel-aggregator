import { EntityRepository, Repository } from 'typeorm';

import { HotelRoom } from '../model/hotel-room.model';

import {
  SearchHotelRoomParams,
  TCreateHotelRoomData,
  TUpdateHotelRoomData,
} from '../interface/hotel-room.interface';
import { ID } from 'src/common/common.types';

interface IHotelRoomStore {
  createHotelRoom: (
    hotelRoomDto: TCreateHotelRoomData,
  ) => Promise<HotelRoom | undefined>;

  findHotelRoomById: (id: ID) => Promise<HotelRoom | undefined>;
  findAllHotelRooms: (
    params: SearchHotelRoomParams,
  ) => Promise<HotelRoom[] | undefined>;
  updateHotelRoom: (
    id: ID,
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

  updateHotelRoom = async (id: ID, hotelRoomDto: TUpdateHotelRoomData) => {
    const hotelRoom = await HotelRoom.update(id, hotelRoomDto);

    return hotelRoom.raw;
  };

  findHotelRoomById = async (id: ID) => {
    return await HotelRoom.findOne(id);
  };

  findAllHotelRooms = async (params: SearchHotelRoomParams) => {
    const { limit, offset, title, isEnabled } = params;

    return await HotelRoom.find({
      skip: offset,
      take: limit,
      where: {
        title: new RegExp(title),
        isEnabled,
      },
    });
  };
}
