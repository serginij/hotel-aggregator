import { User } from '../model/user.model';

export interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}

export type TBaseUserInfo = Omit<User, 'passwordHash' | 'role'>;
