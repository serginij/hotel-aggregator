import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  IGetUnreadCount,
  IMarkMessagesAsRead,
} from '../interface/support-message.interface';
import {
  ICheckUserAccess,
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
  checkUserAccess(params: ICheckUserAccess): Promise<boolean>;
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
      userId: userId.toString(),
      isActive: true,
    });

    if (!request) return null;

    await this.supportMessageStore.createSupportMessage({
      text,
      author: userId.toString(),
      supportRequest: request.id.toString(),
    });

    return request;
  };

  markMessagesAsRead = async (data: IMarkMessagesAsRead) => {
    const res = await this.supportMessageStore.markUserMessagesAsRead(data);

    return res;
  };

  getUnreadCount = async (params: IGetUnreadCount) => {
    const data = await this.supportMessageStore.getUnreadUserMessages(params);

    return data.length;
  };

  checkUserAccess = async (params: ICheckUserAccess) => {
    const request = await this.supportRequestStore.findSupportRequestById(
      params.supportRequest,
    );

    return request?.userId === params.userId.toString();
  };
}
