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

  findSupportRequests = async (params: ISearchSupportRequestParams) => {
    const res = await this.supportRequestStore.findAllSupportRequests(params);

    return res;
  };

  sendMessage = async (data: TSendMessageData) => {
    const { author, supportRequest, text } = data;
    const res = await this.supportMessageStore.createSupportMessage({
      text,
      author: author.toString(),
      supportRequest,
    });

    return res;
  };

  getMessages = async (supportRequest: ID) => {
    const messages =
      await this.supportMessageStore.findAllSupportRequestMessages({
        supportRequest,
      });

    return messages;
  };

  subscribe = (
    handler: (supportRequest: ID, message: TBaseMessageInfo) => void,
  ) => {
    Emitter.on(EmitterEvents.SEND_MESSAGE, (message: TBaseMessageInfo) => {
      console.log('message from emitter', message);

      handler(message.supportRequest, message);
    });
  };
}
