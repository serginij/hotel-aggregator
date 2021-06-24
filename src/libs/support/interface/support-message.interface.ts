import { SupportMessage } from '../model/support-message.model';

export interface SearchSupportMessageParams {
  limit: number;
  offset: number;
  title: string;
}

export type TBaseSupportMessageInfo = Pick<
  SupportMessage,
  'id' | 'author' | 'sendAt' | 'text'
>;

export type TCreateSupportMessageData = Pick<
  SupportMessage,
  'author' | 'text' | 'supportRequest'
>;

export type TUpdateSupportMessageData = Partial<TCreateSupportMessageData>;
