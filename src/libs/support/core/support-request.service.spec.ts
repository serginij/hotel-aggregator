import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ID } from 'src/common/common.types';
import { Emitter, EmitterEvents } from 'src/common/emitter/emitter';
import { TSendMessageData } from '../interface/support-message.interface';
import { ISearchSupportRequestParams } from '../interface/support-request.interface';

import { SupportMessageStore } from '../store/support-message.store';
import { SupportRequestStore } from '../store/support-request.store';

import { SupportRequestService } from './support-request.service';

describe('BookService', () => {
  let supportRequestService: SupportRequestService;

  const MockRequestModel = () => ({
    findAllSupportRequests: ({ isActive }: ISearchSupportRequestParams) =>
      isActive
        ? [
            {
              id: '',
              createdAt: '',
              isActive: true,
              hasNewMessages: true,
              client: {
                id: '',
                name: '',
                email: '',
                contactPhone: '',
              },
            },
          ]
        : [],
  });
  const MockMessageModel = () => ({
    findAllSupportRequestMessages: () => [],
    createSupportMessage: (data: any) => [data],
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SupportRequestService,
        {
          provide: getRepositoryToken(SupportRequestStore),
          useFactory: MockRequestModel,
        },
        {
          provide: getRepositoryToken(SupportMessageStore),
          useFactory: MockMessageModel,
        },
      ],
    }).compile();

    supportRequestService = moduleRef.get<SupportRequestService>(
      SupportRequestService,
    );
  });

  describe('findSupportRequests', () => {
    it('should return array with 1 element', async () => {
      const mockData: ISearchSupportRequestParams = {
        isActive: true,
        limit: 1,
        offset: 0,
      };
      const result = [
        {
          id: '',
          createdAt: '',
          isActive: true,
          hasNewMessages: true,
          client: {
            id: '',
            name: '',
            email: '',
            contactPhone: '',
          },
        },
      ];

      expect(
        await supportRequestService.findSupportRequests(mockData),
      ).toStrictEqual(result);
    });
  });

  it('should return all support requests based on props & call findAllSupportRequests', async () => {
    const mockData: ISearchSupportRequestParams = {
      isActive: false,
      limit: 1,
      offset: 0,
    };
    const result = [];

    expect(
      await supportRequestService.findSupportRequests(mockData),
    ).toStrictEqual(result);
  });

  describe('getMessages', () => {
    it('should return all messages', async () => {
      const mockData: ID = '123';
      const result = [];

      expect(await supportRequestService.getMessages(mockData)).toStrictEqual(
        result,
      );
    });
  });

  describe('sendMessage', () => {
    it('should return all messages', async () => {
      const mockData: TSendMessageData = {
        author: '124',
        text: 'hello world',
        supportRequest: '22223',
      };

      const result = [
        {
          author: '124',
          text: 'hello world',
          supportRequest: '22223',
        },
      ];

      expect(await supportRequestService.sendMessage(mockData)).toStrictEqual(
        result,
      );
    });
  });

  describe('subscribe', () => {
    it('should subscribe to messages', async () => {
      const messageHandler = jest.fn();

      supportRequestService.subscribe(messageHandler);
      expect(messageHandler).toHaveBeenCalledTimes(0);

      Emitter.emit(EmitterEvents.SEND_MESSAGE, {});
      expect(messageHandler).toHaveBeenCalledTimes(1);

      Emitter.emit(EmitterEvents.SEND_MESSAGE, {});
      expect(messageHandler).toHaveBeenCalledTimes(2);
    });
  });
});
