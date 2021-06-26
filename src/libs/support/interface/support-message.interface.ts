import { ID } from 'src/common/common.types';
import { SupportMessage } from '../model/support-message.model';

export interface SearchMessageParams {
  text?: string;
  supportRequest: ID;
}

export type TBaseMessageInfo = Pick<
  SupportMessage,
  'id' | 'author' | 'sentAt' | 'text' | 'supportRequest'
>;

export type TSendMessageData = Pick<
  SupportMessage,
  'author' | 'text' | 'supportRequest'
>;

export type TUpdateSupportMessageData = Partial<TSendMessageData>;

export interface IMarkMessagesAsRead {
  userId: ID;
  supportRequest: ID;
  createdBefore: Date;
}

export interface IGetUnreadCount {
  userId: ID;
  supportRequest: ID;
}
