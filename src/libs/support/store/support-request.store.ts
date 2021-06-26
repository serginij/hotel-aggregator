import { EntityRepository, Repository } from 'typeorm';

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
    const { limit, offset, isActive, userId } = params;

    return await SupportRequest.find({
      skip: offset,
      take: limit,
      where: {
        isActive: { $eq: isActive },
        userId: { $eq: userId?.toString() },
      },
    });
  };

  closeRequest = async (id: ID) => {
    return await (
      await SupportRequest.update(id, { isActive: false })
    ).raw;
  };
}
