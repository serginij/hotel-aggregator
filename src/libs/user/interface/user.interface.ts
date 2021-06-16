import { User } from '../model/user.model';

export interface SearchUserParams {
  limit: number;
  offset: number;
  email?: string;
  name?: string;
  contactPhone?: string;
}

export type TBaseUserInfo = Pick<
  User,
  'id' | 'email' | 'name' | 'contactPhone'
>;

export type TCreateUserData = Pick<
  User,
  'email' | 'name' | 'contactPhone' | 'passwordHash' | 'role'
>;
