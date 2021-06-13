import { RoleEnum } from 'src/common/common.types';

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
