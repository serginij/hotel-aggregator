export class UserDto {
  readonly email: string;

  readonly password: string;

  readonly name: string;

  readonly role?: 'client' | 'admin' | 'manager';

  readonly contactPhone?: string;
}

export class CreateUserDto {
  readonly email: string;

  readonly password: string;

  readonly name: string;

  readonly contactPhone?: string;
}
