import { EntityRepository, getMongoManager, Repository } from 'typeorm';
import { SupportMessage } from '../model/support-message.model';

import {
  IGetUnreadCount,
  IMarkMessagesAsRead,
  ISupportRequestMessageData,
  SearchMessageParams,
  TSendMessageData,
  TUpdateSupportMessageData,
} from '../interface/support-message.interface';
import { ID } from 'src/common/common.types';
import { ObjectId } from 'mongodb';

interface ISupportMessageStore {
  createSupportMessage: (
    message: TSendMessageData,
  ) => Promise<ISupportRequestMessageData[] | undefined>;
  updateSupportMessage: (
    id: ID,
    message: TUpdateSupportMessageData,
  ) => Promise<SupportMessage | undefined>;
  findSupportMessageById: (id: ID) => Promise<SupportMessage | undefined>;
  findAllSupportRequestMessages: (
    params: SearchMessageParams,
  ) => Promise<ISupportRequestMessageData[] | undefined>;
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
    const { text, author, supportRequest } = message;
    const supportMessage = SupportMessage.create({
      text,
      author: ObjectId(author),
      supportRequest: ObjectId(supportRequest),
    });

    await supportMessage.save();

    return await this.findAllSupportRequestMessages({ supportRequest });
  };

  findSupportMessageById = async (id: ID) => {
    return await SupportMessage.findOne(id);
  };

  findAllSupportRequestMessages = async (params: SearchMessageParams) => {
    const { text, supportRequest } = params;

    const res = getMongoManager().aggregate(SupportMessage, [
      {
        $match: {
          text: new RegExp(text || ''),
          supportRequest: { $eq: ObjectId(supportRequest) },
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'author',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $project: {
          id: 1,
          sentAt: 1,
          readAt: 1,
          text: 1,
          author: {
            id: {
              $arrayElemAt: ['$client._id', 0],
            },
            name: {
              $arrayElemAt: ['$client.name', 0],
            },
          },
        },
      },
    ]);

    const data = await res.toArray();

    return data;
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

    const now = new Date();

    const res = await SupportMessage.update(
      {
        author: { $eq: ObjectId(userId) },
        supportRequest: { $eq: ObjectId(supportRequest) },
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
