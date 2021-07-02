import { ID } from 'src/common/common.types';
import { SupportRequest } from '../model/support-request.model';

export interface ISearchSupportRequestParams {
  userId?: ID;
  isActive: boolean;
  limit: number;
  offset: number;
  selectUser?: boolean;
}

export type TBaseSupportRequestInfo = Pick<
  SupportRequest,
  'id' | 'userId' | 'createdAt'
> & { hasNewMessages: boolean };

export type TCreateSupportRequestData = Pick<SupportRequest, 'userId'> & {
  text: string;
};

export type TCreateSupportRequest = Pick<SupportRequest, 'userId'> & {
  isActive: boolean;
};

export interface ICheckUserAccess {
  userId: ID;
  supportRequest: ID;
}

export interface ISupportRequestInfo {
  id: string;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
  client: {
    id: string;
    name: string;
    email: string;
    contactPhone: string;
  };
}
