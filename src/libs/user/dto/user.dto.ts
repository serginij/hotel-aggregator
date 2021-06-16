import { Transform, Type } from 'class-transformer';
import { IsEmail, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from 'src/common/common.types';
import { SearchUserParams } from '../interface/user.interface';

export class UserDto {
  @IsEmail()
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly name: string;

  @IsEnum(RoleEnum)
  @IsOptional()
  readonly role?: RoleEnum;

  @IsOptional()
  @IsString()
  readonly contactPhone?: string;
}

export class CreateUserDto {
  @IsEmail()
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly contactPhone?: string;
}

export class SearchUserQuery implements SearchUserParams {
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit: number;

  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  offset: number;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}
