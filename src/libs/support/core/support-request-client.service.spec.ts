import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  IGetUnreadCount,
  IMarkMessagesAsRead,
} from '../interface/support-message.interface';
import {
  ICheckUserAccess,
  TCreateSupportRequest,
  TCreateSupportRequestData,
} from '../interface/support-request.interface';

import { SupportMessageStore } from '../store/support-message.store';
import { SupportRequestStore } from '../store/support-request.store';
import { SupportRequestClientService } from './support-request-client.service';

describe('BookService', () => {
  let supportRequestClientService: SupportRequestClientService;

  const MockRequestModel = () => ({
    findSupportRequestById: () => ({ userId: '123' }),
    createSupportRequest: ({ userId }: TCreateSupportRequest) =>
      userId === '123' ? { id: 'qw' } : null,
  });
  const MockMessageModel = () => ({
    findAllSupportRequestMessages: () => [],
    createSupportMessage: jest.fn(),
    getUnreadUserMessages: () => [],
    markUserMessagesAsRead: () => true,
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SupportRequestClientService,
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

    supportRequestClientService = moduleRef.get<SupportRequestClientService>(
      SupportRequestClientService,
    );
  });

  describe('createSupportRequest', () => {
    it('should return null (no request)', async () => {
      const mockData: TCreateSupportRequestData = {
        text: 'qqq',
        userId: '',
      };
      const result = null;

      expect(
        await supportRequestClientService.createSupportRequest(mockData),
      ).toEqual(result);
    });
  });

  it('should return new support request', async () => {
    const mockData: TCreateSupportRequestData = {
      text: 'test',
      userId: '123',
    };
    const result = {
      id: 'qw',
      hasNewMessages: false,
    };

    expect(
      await supportRequestClientService.createSupportRequest(mockData),
    ).toStrictEqual(result);
  });

  describe('markMessagesAsRead', () => {
    it('should return all messages', async () => {
      const mockData: IMarkMessagesAsRead = {
        userId: '124',
        supportRequest: '22223',
        createdBefore: new Date(),
      };
      const result = true;

      expect(
        await supportRequestClientService.markMessagesAsRead(mockData),
      ).toEqual(result);
    });
  });

  describe('getUnreadCount', () => {
    it('should return all messages', async () => {
      const mockData: IGetUnreadCount = {
        userId: '124',
        supportRequest: '22223',
      };

      const result = 0;

      expect(
        await supportRequestClientService.getUnreadCount(mockData),
      ).toEqual(result);
    });
  });

  describe('checkUserAccess', () => {
    it('should subscribe to messages', async () => {
      const mockData: ICheckUserAccess = {
        userId: '123',
        supportRequest: 'qw',
      };

      const hasAccess = await supportRequestClientService.checkUserAccess(
        mockData,
      );

      expect(hasAccess).toEqual(true);

      mockData.userId = '3';
      const noAccess = await supportRequestClientService.checkUserAccess(
        mockData,
      );

      expect(noAccess).toEqual(false);
    });
  });
});
