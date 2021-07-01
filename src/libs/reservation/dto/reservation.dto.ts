import { Transform, Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { ID } from 'src/common/common.types';

import { SearchReservationParams } from '../interface/reservation.interface';

export class ReservationDto {
  @IsString()
  hotelId: ID;

  @IsString()
  roomId: ID;

  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  dateStart: Date;

  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  dateEnd: Date;
}

export class SearchUserReservationDto implements SearchReservationParams {
  @Type(() => String)
  dateStart: Date;

  @Type(() => String)
  dateEnd: Date;
}
