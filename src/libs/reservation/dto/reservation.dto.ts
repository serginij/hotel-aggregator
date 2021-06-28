import { Transform, Type } from 'class-transformer';
import { IsDate, IsDateString, IsString } from 'class-validator';

import { SearchReservationParams } from '../interface/reservation.interface';

export class ReservationDto {
  @IsString()
  hotelId: string;

  @IsString()
  roomId: string;

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
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  dateStart: Date;

  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  dateEnd: Date;
}
