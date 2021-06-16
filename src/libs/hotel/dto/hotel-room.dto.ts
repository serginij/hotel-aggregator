import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

import { SearchHotelRoomParams } from '../interface/hotel-room.interface';

export class HotelRoomDto {
  @IsString()
  readonly hotel: string;

  @IsString()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  // @IsArray()
  // @IsString({ each: true })
  readonly images: string[];
}

export class UpdateHotelRoomDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly images?: string[];
}

export class SearchHotelRoomDto implements SearchHotelRoomParams {
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit: number;

  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  offset: number;

  @IsString()
  title: string;

  @IsBoolean()
  @IsOptional()
  isEnabled?: true;
}
