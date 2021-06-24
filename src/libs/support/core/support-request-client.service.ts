import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  IGetUnreadCount,
  IMarkMessagesAsRead,
} from '../interface/support-message.interface';
import {
  TBaseSupportRequestInfo,
  TCreateSupportRequestData,
} from '../interface/support-request.interface';
import { SupportMessageStore } from '../store/support-message.store';
import { SupportRequestStore } from '../store/support-request.store';

interface ISupportRequestClientService {
  createSupportRequest(
    data: TCreateSupportRequestData,
  ): Promise<TBaseSupportRequestInfo | null>;
  markMessagesAsRead(params: IMarkMessagesAsRead);
  getUnreadCount(params: IGetUnreadCount): Promise<number>;
}

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectRepository(SupportRequestStore)
    private readonly supportRequestStore: SupportRequestStore,
    @InjectRepository(SupportMessageStore)
    private readonly supportMessageStore: SupportMessageStore,
  ) {}

  createSupportRequest = async (data: TCreateSupportRequestData) => {
    const { text, userId } = data;

    const request = await this.supportRequestStore.createSupportRequest({
      userId,
    });

    if (!request) return null;

    const message = await this.supportMessageStore.createSupportMessage({
      text,
      author: userId,
      supportRequest: request,
    });

    return request;
  };

  markMessagesAsRead = async (data: IMarkMessagesAsRead) => {
    const res = await this.supportMessageStore.markUserMessagesAsRead(data);

    return res;
  };

  getUnreadCount = async (params: IGetUnreadCount) => {
    const data = await this.supportMessageStore.getUnreadUserMessagesCount(
      params,
    );

    return data.length;
  };
}
