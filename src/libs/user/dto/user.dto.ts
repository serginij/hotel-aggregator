import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from 'src/common/common.types';
import { SearchUserParams } from '../interface/user.interface';

export class UserDto {
  readonly email: string;

  readonly password: string;

  readonly name: string;

  readonly role?: RoleEnum;

  readonly contactPhone?: string;
}

export class CreateUserDto {
  readonly email: string;

  readonly password: string;

  readonly name: string;

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
