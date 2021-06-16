import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

import { SearchHotelParams } from '../interface/hotel.interface';

export class HotelDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class SearchHotelDto implements SearchHotelParams {
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit: number;

  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  offset: number;

  @IsString()
  @IsOptional()
  title: string;
}
