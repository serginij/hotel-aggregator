import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ID } from 'src/common/common.types';
import {
  IMarkMessagesAsRead,
  IGetUnreadCount,
} from '../interface/support-message.interface';
import { SupportMessageStore } from '../store/support-message.store';
import { SupportRequestStore } from '../store/support-request.store';

interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: IMarkMessagesAsRead);
  getUnreadCount(params: IGetUnreadCount): Promise<number>;
  closeRequest(supportRequest: ID): Promise<boolean>;
}

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectRepository(SupportRequestStore)
    private readonly supportRequestStore: SupportRequestStore,
    @InjectRepository(SupportMessageStore)
    private readonly supportMessageStore: SupportMessageStore,
  ) {}

  markMessagesAsRead = async (data: IMarkMessagesAsRead) => {
    const res = await this.supportMessageStore.markManagerMessagesAsRead(data);

    return res;
  };

  getUnreadCount = async (params: IGetUnreadCount) => {
    const data = await this.supportMessageStore.getUnreadManagerMessages(
      params,
    );

    return data.length;
  };

  closeRequest = async (request: ID) => {
    const res = await this.supportRequestStore.closeRequest(request);

    return !!res;
  };
}
