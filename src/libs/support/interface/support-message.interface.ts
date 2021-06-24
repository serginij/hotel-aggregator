import { ID } from 'src/common/common.types';
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
export interface IMarkMessagesAsRead {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
}

export interface IGetUnreadCount {
  user: ID;
  supportRequest: ID;
}
