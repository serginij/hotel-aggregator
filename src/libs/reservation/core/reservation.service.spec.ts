import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ID } from 'src/common/common.types';
import { Emitter, EmitterEvents } from 'src/common/emitter/emitter';
import {
  CreateUserReservationData,
  SearchReservationParams,
} from '../interface/reservation.interface';

import { ReservationStore } from '../store/reservation.store';

import { ReservationService } from './reservation.service';

describe('BookService', () => {
  let reservationService: ReservationService;

  const MockModel = () => ({
    findAllReservations: ({ hotelId }: SearchReservationParams) =>
      hotelId === '123' ? [{}] : [],
    createReservation: ({ hotelId }: CreateUserReservationData) =>
      hotelId === '345' ? true : false,
    findById: (id) => (id === '123' ? { userId: '123' } : {}),
    removeReservation: () => true,
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(ReservationStore),
          useFactory: MockModel,
        },
      ],
    }).compile();

    reservationService = moduleRef.get<ReservationService>(ReservationService);
  });

  describe('create', () => {
    it('should return resevation', async () => {
      const mockData: CreateUserReservationData = {
        hotelId: '345',
        roomId: '',
        dateStart: new Date(),
        dateEnd: new Date(),
        userId: '',
      };
      const result = true;

      expect(await reservationService.create(mockData)).toBe(result);
    });

    it('should throw an exception', async () => {
      const mockData: CreateUserReservationData = {
        hotelId: '123',
        roomId: '',
        dateStart: new Date(),
        dateEnd: new Date(),
        userId: '',
      };

      await expect(reservationService.create(mockData)).rejects.toThrow();
    });

    it('should return null', async () => {
      const mockData: CreateUserReservationData = {
        hotelId: '',
        roomId: '',
        dateStart: new Date(),
        dateEnd: new Date(),
        userId: '',
      };
      const result = null;

      expect(await reservationService.create(mockData)).toBe(result);
    });
  });

  it('should return all support requests based on props & call findAllSupportRequests', async () => {
    // const mockData: ISearchSupportRequestParams = {
    //   isActive: false,
    //   limit: 1,
    //   offset: 0,
    // };
    // const result = [];
    // expect(
    //   await supportRequestService.findSupportRequests(mockData),
    // ).toStrictEqual(result);
  });

  describe('deleteReservation', () => {
    it('should return all messages', async () => {
      // const mockData: ID = '123';
      // const result = [];
      // expect(await supportRequestService.getMessages(mockData)).toStrictEqual(
      //   result,
      // );
    });
  });

  describe('findAllUserReservations', () => {
    it('should return all messages', async () => {
      // const mockData: TSendMessageData = {
      //   author: '124',
      //   text: 'hello world',
      //   supportRequest: '22223',
      // };
      // const result = [
      //   {
      //     author: '124',
      //     text: 'hello world',
      //     supportRequest: '22223',
      //   },
      // ];
      // expect(await supportRequestService.sendMessage(mockData)).toStrictEqual(
      //   result,
      // );
    });
  });

  describe('findAllReservations', () => {
    it('should subscribe to messages', async () => {
      // const mockData: TSendMessageData = {
      //   author: '124',
      //   text: 'hello world',
      //   supportRequest: '22223',
      // };
      // const result = [
      //   {
      //     author: '124',
      //     text: 'hello world',
      //     supportRequest: '22223',
      //   },
      // ];
      // expect(await supportRequestService.sendMessage(mockData)).toStrictEqual(
      //   result,
      // );
    });
  });

  describe('deleteUserReservation', () => {
    it('should delete reservation', async () => {
      // const mockData: TSendMessageData = {
      //   author: '124',
      //   text: 'hello world',
      //   supportRequest: '22223',
      // };
      // const result = [
      //   {
      //     author: '124',
      //     text: 'hello world',
      //     supportRequest: '22223',
      //   },
      // ];
      // expect(await supportRequestService.sendMessage(mockData)).toStrictEqual(
      //   result,
      // );
    });

    it('should throw an exception', async () => {
      // const mockData: TSendMessageData = {
      //   author: '124',
      //   text: 'hello world',
      //   supportRequest: '22223',
      // };
      // const result = [
      //   {
      //     author: '124',
      //     text: 'hello world',
      //     supportRequest: '22223',
      //   },
      // ];
      // expect(await supportRequestService.sendMessage(mockData)).toStrictEqual(
      //   result,
      // );
    });
  });
});
