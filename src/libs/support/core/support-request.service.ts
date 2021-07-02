import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ID } from 'src/common/common.types';
import { Emitter, EmitterEvents } from 'src/common/emitter/emitter';
import {
  ISupportRequestMessageData,
  TBaseMessageInfo,
  TSendMessageData,
} from '../interface/support-message.interface';
import {
  ISearchSupportRequestParams,
  ISupportRequestInfo,
} from '../interface/support-request.interface';
import { SupportMessageStore } from '../store/support-message.store';
import { SupportRequestStore } from '../store/support-request.store';

interface ISupportRequestService {
  findSupportRequests(
    params: ISearchSupportRequestParams,
  ): Promise<ISupportRequestInfo[]>;
  sendMessage(data: TSendMessageData): Promise<ISupportRequestMessageData[]>;
  getMessages(supportRequest: ID): Promise<ISupportRequestMessageData[]>;
  subscribe(
    handler: (supportRequest: ID, message: TBaseMessageInfo) => void,
  ): void;
}

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectRepository(SupportRequestStore)
    private readonly supportRequestStore: SupportRequestStore,
    @InjectRepository(SupportMessageStore)
    private readonly supportMessageStore: SupportMessageStore,
  ) {}

  // Get all support requests by filters
  findSupportRequests = async (params: ISearchSupportRequestParams) => {
    const res = await this.supportRequestStore.findAllSupportRequests(params);

    return res;
  };

  // Send message to specific support request
  sendMessage = async (data: TSendMessageData) => {
    const res = await this.supportMessageStore.createSupportMessage(data);

    return res;
  };

  // Get all messages from support request
  getMessages = async (supportRequest: ID) => {
    const messages =
      await this.supportMessageStore.findAllSupportRequestMessages({
        supportRequest,
      });

    return messages;
  };

  // Subscribes to support request messages
  subscribe = (
    handler: (supportRequest: ID, message: TBaseMessageInfo) => void,
  ) => {
    Emitter.on(EmitterEvents.SEND_MESSAGE, (message: TBaseMessageInfo) => {
      console.log('message from emitter', message);

      handler(message.supportRequest, message);
    });
  };
}
