import { EntityRepository, Repository } from 'typeorm';
import { SupportMessage } from '../model/support-message.model';

import {
  IGetUnreadCount,
  IMarkMessagesAsRead,
  SearchMessageParams,
  TSendMessageData,
  TUpdateSupportMessageData,
} from '../interface/support-message.interface';
import { ID } from 'src/common/common.types';

interface ISupportMessageStore {
  createSupportMessage: (
    message: TSendMessageData,
  ) => Promise<SupportMessage | undefined>;
  updateSupportMessage: (
    id: ID,
    message: TUpdateSupportMessageData,
  ) => Promise<SupportMessage | undefined>;
  findSupportMessageById: (id: ID) => Promise<SupportMessage | undefined>;
  findAllSupportRequestMessages: (
    params: SearchMessageParams,
  ) => Promise<SupportMessage[] | undefined>;
  markUserMessagesAsRead: (data: IMarkMessagesAsRead) => Promise<boolean>;
  markManagerMessagesAsRead: (data: IMarkMessagesAsRead) => Promise<boolean>;
  getUnreadUserMessages: (params: IGetUnreadCount) => Promise<SupportMessage[]>;
  getUnreadManagerMessages: (
    params: IGetUnreadCount,
  ) => Promise<SupportMessage[]>;
}

@EntityRepository(SupportMessage)
export class SupportMessageStore
  extends Repository<SupportMessage>
  implements ISupportMessageStore
{
  createSupportMessage = async (message: TSendMessageData) => {
    const supportMessage = SupportMessage.create(message);

    return await supportMessage.save();
  };

  findSupportMessageById = async (id: ID) => {
    return await SupportMessage.findOne(id);
  };

  findAllSupportRequestMessages = async (params: SearchMessageParams) => {
    const { text, supportRequest } = params;

    return await SupportMessage.find({
      where: {
        text: new RegExp(text || ''),
        supportRequest: { $eq: supportRequest.toString() },
      },
    });
  };

  updateSupportMessage = async (
    id: ID,
    supportMessageDto: TUpdateSupportMessageData,
  ) => {
    const supportMessage = await SupportMessage.update(id, supportMessageDto);

    return supportMessage.raw;
  };

  markManagerMessagesAsRead = async (
    data: IMarkMessagesAsRead,
  ): Promise<boolean> => {
    const { supportRequest, createdBefore, userId } = data;

    const now = Date.now();

    const res = await SupportMessage.update(
      {
        author: { $eq: userId.toString() },
        supportRequest: { $eq: supportRequest.toString() },
        readAt: null,
        sentAt: { $lte: createdBefore },
      } as any,
      { readAt: now },
    );

    return !!res;
  };

  markUserMessagesAsRead = async (
    data: IMarkMessagesAsRead,
  ): Promise<boolean> => {
    const { supportRequest, createdBefore, userId } = data;

    const now = Date.now();

    const res = await SupportMessage.update(
      {
        author: { $not: { $eq: userId.toString() } },
        supportRequest: { $eq: supportRequest.toString() },
        readAt: null,
        sentAt: { $lte: createdBefore },
      } as any,
      { readAt: now },
    );

    return !!res;
  };

  getUnreadUserMessages = async (params: IGetUnreadCount) => {
    const { userId, supportRequest } = params;

    return await SupportMessage.find({
      where: {
        author: { $not: { $eq: userId.toString() } },
        supportRequest: { $eq: supportRequest.toString() },
        readAt: null,
      },
    });
  };

  getUnreadManagerMessages = async (params: IGetUnreadCount) => {
    const { userId, supportRequest } = params;

    return await SupportMessage.find({
      where: {
        author: { $not: { $eq: userId.toString() } },
        supportRequest: { $eq: supportRequest.toString() },
        readAt: null,
      },
    });
  };
}
