import { EntityRepository, getMongoManager, Repository } from 'typeorm';

import { SupportRequest } from '../model/support-request.model';

import {
  ISearchSupportRequestParams,
  TCreateSupportRequest,
} from '../interface/support-request.interface';
import { ID } from 'src/common/common.types';

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

    const clientField = selectUser
      ? {
          client: {
            $let: {
              vars: {
                fUser: {
                  $arrayElemAt: ['$client', 0],
                },
              },
              in: {
                id: '$$fUser.id',
                name: '$$fUser.name',
                email: '$$fUser.email',
                contactPhone: '$$fUser.contactPhone',
              },
            },
          },
        }
      : {};

    const userIdMatch = userId ? { userId: { $eq: userId } } : {};

    const result = mongoManager
      .aggregate(SupportRequest, [
        {
          $match: {
            isActive: { $eq: isActive },
            ...userIdMatch,
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

            ...clientField,
          },
        },
      ])
      .skip(offset)
      .limit(limit);

    const data = await result.toArray();

    return data;
  };

  closeRequest = async (id: ID) => {
    return await (
      await SupportRequest.update(id, { isActive: false })
    ).raw;
  };
}
