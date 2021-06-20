import { ObjectID } from 'typeorm';

export enum RoleEnum {
  ADMIN = 'admin',
  CLIENT = 'client',
  MANAGER = 'manager',
}

export type ID = string | ObjectID;
