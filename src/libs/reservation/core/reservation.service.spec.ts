import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import {
  CreateUserReservationData,
  SearchReservationParams,
  SearchUserReservationParams,
} from '../interface/reservation.interface';

import { ReservationStore } from '../store/reservation.store';

import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  let reservationService: ReservationService;

  const MockModel = () => ({
    findAllReservations: ({ hotelId }: SearchReservationParams) =>
      hotelId === '123' ? [{}] : [],
    createReservation: ({ hotelId }: CreateUserReservationData) =>
      hotelId === '345' ? true : false,
    findById: (id) => (id === '123' ? { userId: '123' } : {}),
    removeReservation: (id: string) => (id === '123' ? true : false),
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

  describe('deleteReservation', () => {
    it('should delete resevation', async () => {
      const mockData = {
        id: '123',
        userId: '123',
      };
      const result = true;

      expect(
        await reservationService.deleteReservation(
          mockData.id,
          mockData.userId,
        ),
      ).toBe(result);
    });

    it('should throw an exception', async () => {
      const mockData = {
        id: '555',
        userId: '123',
      };

      await expect(
        reservationService.deleteReservation(mockData.id, mockData.userId),
      ).rejects.toThrow();
    });
  });

  describe('findAllUserReservations', () => {
    it('should return all messages', async () => {
      const mockData: SearchUserReservationParams = {
        userId: '',
        dateEnd: new Date(),
        dateStart: new Date(),
      };
      const result = [];

      expect(
        await reservationService.findAllUserReservations(mockData),
      ).toStrictEqual(result);
    });
  });

  describe('findAllReservations', () => {
    it('should subscribe to messages', async () => {
      const mockData: SearchReservationParams = {
        userId: '',
        dateEnd: new Date(),
        dateStart: new Date(),
        hotelId: '123',
      };
      const result = [{}];

      expect(
        await reservationService.findAllReservations(mockData),
      ).toStrictEqual(result);
    });
  });

  describe('deleteUserReservation', () => {
    it('should delete resevation', async () => {
      const mockData = {
        id: '123',
        userId: '123',
      };
      const result = true;

      expect(
        await reservationService.deleteUserReservation(
          mockData.id,
          mockData.userId,
        ),
      ).toBe(result);
    });

    it('should throw an exception', async () => {
      const mockData = {
        id: '555',
        userId: '123',
      };

      await expect(
        reservationService.deleteUserReservation(mockData.id, mockData.userId),
      ).rejects.toThrow();
    });
  });
});
