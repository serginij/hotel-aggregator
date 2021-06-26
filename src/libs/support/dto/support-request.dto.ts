import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateSupportRequestDto {
  @IsString()
  text: string;
}

export class SearchSupportRequestDto {
  @IsBoolean()
  @Type(() => Boolean)
  isActive: boolean;

  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit: number;

  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  offset: number;
}
