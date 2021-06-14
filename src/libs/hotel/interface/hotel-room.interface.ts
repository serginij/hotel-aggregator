import { HotelRoom } from '../model/hotel-room.model';

export interface SearchHotelRoomParams {
  limit: number;
  offset: number;
  title: string;
  isEnabled?: true;
}

export type TBaseHotelRoomInfo = Pick<
  HotelRoom,
  'id' | 'images' | 'description' | 'hotel'
>;

export type TCreateHotelRoomData = Pick<
  HotelRoom,
  'hotel' | 'description' | 'images'
>;

export type TUpdateHotelRoomData = Partial<TCreateHotelRoomData>;
