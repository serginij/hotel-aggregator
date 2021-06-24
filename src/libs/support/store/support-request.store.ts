import { EntityRepository, Repository } from 'typeorm';

import { SupportRequest } from '../model/support-request.model';

import {
  SearchSupportRequestParams,
  TCreateSupportRequest,
  TUpdateSupportRequestData,
} from '../interface/support-request.interface';
import { ID } from 'src/common/common.types';

interface ISupportRequestStore {
  createSupportRequest: (
    supportRequest: TCreateSupportRequest,
  ) => Promise<SupportRequest | undefined>;
  updateSupportRequest: (
    id: ID,
    supportRequestDto: TUpdateSupportRequestData,
  ) => Promise<SupportRequest | undefined>;
  findSupportRequestById: (id: ID) => Promise<SupportRequest | undefined>;
  findAllSupportRequests: (
    params: SearchSupportRequestParams,
  ) => Promise<SupportRequest[] | undefined>;
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

  findAllSupportRequests = async (params: SearchSupportRequestParams) => {
    const { limit, offset, title } = params;

    return await SupportRequest.find({
      skip: offset,
      take: limit,
      where: {
        title: new RegExp(title),
      },
    });
  };

  updateSupportRequest = async (
    id: ID,
    supportRequestDto: TUpdateSupportRequestData,
  ) => {
    const supportRequest = await SupportRequest.update(id, supportRequestDto);

    return supportRequest.raw;
  };
}
