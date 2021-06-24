import { EntityRepository, Repository } from 'typeorm';

import { SupportMessage } from '../model/support-message.model';

import {
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
}
