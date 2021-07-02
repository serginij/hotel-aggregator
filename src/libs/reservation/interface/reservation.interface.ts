import { ID } from 'src/common/common.types';
import { Reservation } from '../model/reservation.model';

export interface SearchReservationParams {
  userId?: ID;
  dateStart?: Date;
  dateEnd?: Date;
  hotelId?: ID;
  roomId?: ID;
}

export type SearchUserReservationParams = Required<
  Pick<SearchReservationParams, 'dateEnd' | 'dateStart' | 'userId'>
>;

export type CreateUserReservationData = Pick<
  Reservation,
  'userId' | 'hotelId' | 'roomId' | 'dateEnd' | 'dateStart'
>;
