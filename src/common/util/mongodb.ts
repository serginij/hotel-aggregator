import { ObjectId } from 'mongodb';
import { ID } from '../common.types';

export const getIdMatch = (id: ID | undefined, field: string) => {
  return id ? { [field]: { $eq: ObjectId(id) } } : {};
};
