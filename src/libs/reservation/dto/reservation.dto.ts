import { Transform } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

import { SearchReservationParams } from '../interface/reservation.interface';

export class ReservationDto {
  @IsString()
  hotelId: string;

  @IsString()
  roomId: string;

  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  dateStart: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  dateEnd: Date;
}

export class SearchUserReservationDto implements SearchReservationParams {
  @IsDate()
  dateStart: Date;

  @IsDate()
  dateEnd: Date;
}
