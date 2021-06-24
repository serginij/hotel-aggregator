import {
  EntityRepository,
  Equal,
  IsNull,
  LessThanOrEqual,
  Not,
  Repository,
} from 'typeorm';

import { SupportMessage } from '../model/support-message.model';

import {
  IGetUnreadCount,
  IMarkMessagesAsRead,
  SearchSupportMessageParams,
  TCreateSupportMessageData,
  TUpdateSupportMessageData,
} from '../interface/support-message.interface';
import { ID } from 'src/common/common.types';

interface ISupportMessageStore {
  createSupportMessage: (
    supportMessage: TCreateSupportMessageData,
  ) => Promise<SupportMessage | undefined>;
  updateSupportMessage: (
    id: ID,
    supportMessageDto: TUpdateSupportMessageData,
  ) => Promise<SupportMessage | undefined>;
  findSupportMessageById: (id: ID) => Promise<SupportMessage | undefined>;
  findAllSupportMessages: (
    params: SearchSupportMessageParams,
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
  createSupportMessage = async (
    supportMessageDto: TCreateSupportMessageData,
  ) => {
    const supportMessage = SupportMessage.create(supportMessageDto);

    return await supportMessage.save();
  };

  findSupportMessageById = async (id: ID) => {
    return await SupportMessage.findOne(id);
  };

  findAllSupportMessages = async (params: SearchSupportMessageParams) => {
    const { limit, offset, title } = params;

    return await SupportMessage.find({
      skip: offset,
      take: limit,
      where: {
        title: new RegExp(title),
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

  markUserMessagesAsRead = async (
    data: IMarkMessagesAsRead,
  ): Promise<boolean> => {
    const { supportRequest, createdBefore, user } = data;

    const now = Date.now();

    const res = await SupportMessage.update(
      {
        author: user as string,
        supportRequest: supportRequest as any,
        sendAt: LessThanOrEqual(createdBefore),
        readAt: IsNull(),
      },
      { readAt: now },
    );

    return !!res;
  };

  markManagerMessagesAsRead = async (
    data: IMarkMessagesAsRead,
  ): Promise<boolean> => {
    const { supportRequest, createdBefore, user } = data;

    const now = Date.now();

    const res = await SupportMessage.update(
      {
        author: Not(Equal(user as string)),
        supportRequest: supportRequest as any,
        sendAt: LessThanOrEqual(createdBefore),
        readAt: IsNull(),
      },
      { readAt: now },
    );

    return !!res;
  };

  getUnreadUserMessages = async (params: IGetUnreadCount) => {
    const { user, supportRequest } = params;

    return await SupportMessage.find({
      where: { author: Not(Equal(user)), supportRequest, readAt: IsNull() },
    });
  };

  getUnreadManagerMessages = async (params: IGetUnreadCount) => {
    const { user, supportRequest } = params;

    return await SupportMessage.find({
      where: { author: Equal(user), supportRequest, readAt: IsNull() },
    });
  };
}
