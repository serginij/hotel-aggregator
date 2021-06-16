import { Hotel } from '../model/hotel.model';

export interface SearchHotelParams {
  limit: number;
  offset: number;
  title: string;
}

export type TBaseHotelInfo = Pick<Hotel, 'id' | 'title' | 'description'>;

export type TCreateHotelData = Pick<Hotel, 'title' | 'description'>;

export type TUpdateHotelData = Partial<TCreateHotelData>;
