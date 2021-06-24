import { SupportRequest } from '../model/support-request.model';

export interface SearchSupportRequestParams {
  limit: number;
  offset: number;
  title: string;
}

export type TBaseSupportRequestInfo = Pick<
  SupportRequest,
  'id' | 'userId' | 'messages' | 'createdAt'
>;

export type TCreateSupportRequestData = Pick<SupportRequest, 'userId'> & {
  text: string;
};

export type TCreateSupportRequest = Pick<SupportRequest, 'userId'>;

export type TUpdateSupportRequestData = Partial<TCreateSupportRequestData>;
