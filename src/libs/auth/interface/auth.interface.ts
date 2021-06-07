import { RoleEnum } from 'src/common/common.types';

export interface IJwtPayload {
  email: string;
  name: string;
  contactPhone?: string;
  role: RoleEnum;
}
