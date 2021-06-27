import { EntityRepository, getMongoManager, Repository } from 'typeorm';

import { SupportRequest } from '../model/support-request.model';

import {
  ISearchSupportRequestParams,
  TCreateSupportRequest,
} from '../interface/support-request.interface';
import { ID } from 'src/common/common.types';
import { SupportMessage } from '../model/support-message.model';

interface ISupportRequestStore {
  createSupportRequest: (
    supportRequest: TCreateSupportRequest,
  ) => Promise<SupportRequest | undefined>;

  findSupportRequestById: (id: ID) => Promise<SupportRequest | undefined>;
  findAllSupportRequests: (
    params: ISearchSupportRequestParams,
  ) => Promise<SupportRequest[] | undefined>;
  closeRequest: (id: ID) => Promise<SupportRequest>;
}

@EntityRepository(SupportRequest)
export class SupportRequestStore
  extends Repository<SupportRequest>
  implements ISupportRequestStore
{
  createSupportRequest = async (supportRequestDto: TCreateSupportRequest) => {
    const supportRequest = SupportRequest.create(supportRequestDto);

    return await supportRequest.save();
  };

  findSupportRequestById = async (id: ID) => {
    return await SupportRequest.findOne(id);
  };

  findAllSupportRequests = async (params: ISearchSupportRequestParams) => {
    const { limit, offset, isActive, userId, selectUser } = params;

    const mongoManager = getMongoManager();

    console.log(params);

    const userLookup = selectUser ? {} : {};
    const clientField = selectUser
      ? {
          client: { $arrayElemAt: ['$client', 0] },
        }
      : {};

    const userIdMatch = userId ? { userId: { $eq: userId.toString() } } : {};

    const result = mongoManager
      .aggregate(SupportRequest, [
        {
          $match: {
            isActive: { $eq: isActive },
            ...userIdMatch,
            // userId: userId ? { $eq: userId.toString() } : undefined,
          },
        },
        {
          $lookup: {
            from: 'support_message',
            localField: '_id',
            foreignField: 'supportRequest',
            as: 'messages',
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'userId',
            foreignField: '_id',
            as: 'client',
          },
        },
        {
          $project: {
            id: 1,
            createdAt: 1,
            isActive: 1,
            hasNewMessages: {
              $toBool: {
                $size: '$messages',
              },
            },
            client: 1,
            // ...clientField,
          },
        },
      ])
      .skip(offset)
      .limit(limit);

    const data = await result.toArray();

    console.log(data);

    return data as any;

    // return await SupportRequest.find({
    //   skip: offset,
    //   take: limit,
    //   where: {
    //     isActive: { $eq: isActive },
    //     userId: { $eq: userId?.toString() },
    //   },
    // });
  };

  closeRequest = async (id: ID) => {
    return await (
      await SupportRequest.update(id, { isActive: false })
    ).raw;
  };
}
