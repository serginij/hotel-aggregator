export class UserDto {
  readonly id: number;

  readonly email: string;

  readonly password: string;

  readonly name: string;

  readonly role?: 'client' | 'admin' | 'manager';

  readonly contactPhone?: boolean;
}
