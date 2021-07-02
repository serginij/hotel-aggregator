import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ID } from 'src/common/common.types';
import { HotelRoomDto } from '../dto/hotel-room.dto';

import {
  SearchHotelRoomParams,
  TCreateHotelRoomData,
  TUpdateHotelRoomData,
} from '../interface/hotel-room.interface';
import { TCreateHotelData } from '../interface/hotel.interface';

import { HotelRoomStore } from '../store/hotel-room.store';
import { HotelStore } from '../store/hotel.store';

import { HotelRoomService } from './hotel-room.service';
import { HotelService } from './hotel.service';

describe('HotelRoomService', () => {
  let hotelRoomService: HotelRoomService;

  const MockModel = () => ({
    updateHotelRoom: (id: ID) => (id === '123' ? {} : null),
    createHotelRoom: ({ title }: TCreateHotelRoomData) =>
      title === '' ? {} : null,
    findHotelRoomById: (id) => (id === '123' ? { title: '' } : null),
    findAllHotelRooms: () => [],
  });

  const MockHotelModel = () => ({
    updateHotel: (id: ID) => (id === '123' ? {} : null),
    createHotel: ({ title }: TCreateHotelData) => (title === '' ? {} : null),
    findHotelById: (id) => (id === '123' ? { title: '' } : null),
    findAllHotels: () => [],
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        HotelService,
        HotelRoomService,
        {
          provide: getRepositoryToken(HotelRoomStore),
          useFactory: MockModel,
        },
        {
          provide: getRepositoryToken(HotelStore),
          useFactory: MockHotelModel,
        },
      ],
    }).compile();

    hotelRoomService = moduleRef.get<HotelRoomService>(HotelRoomService);
  });

  describe('create', () => {
    it('should return hotelRoom', async () => {
      const mockData: HotelRoomDto = {
        hotel: '123',
        title: '',
        description: '',
        images: [],
      };
      const result = {};

      expect(await hotelRoomService.create(mockData)).toStrictEqual(result);
    });

    it('should throw an error', async () => {
      const mockData: HotelRoomDto = {
        hotel: '',
        title: '',
        description: '',
        images: [],
      };

      await expect(hotelRoomService.create(mockData)).rejects.toThrow();
    });

    it('should return null', async () => {
      const mockData: HotelRoomDto = {
        hotel: '123',
        title: 'a',
        description: '',
        images: [],
      };
      const result = null;

      expect(await hotelRoomService.create(mockData)).toBe(result);
    });
  });

  describe('findById', () => {
    it('should return hotelRoom', async () => {
      const mockData = '123';
      const result = { title: '' };

      expect(await hotelRoomService.findById(mockData)).toStrictEqual(result);
    });

    it('should return null', async () => {
      const mockData = '';
      const result = null;

      expect(await hotelRoomService.findById(mockData)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all messages', async () => {
      const mockData: SearchHotelRoomParams = {
        limit: 10,
        offset: 1,
        title: '',
      };
      const result = [];

      expect(await hotelRoomService.findAll(mockData)).toStrictEqual(result);
    });
  });

  describe('update', () => {
    it('should return hotelRoom', async () => {
      const mockData: TUpdateHotelRoomData = {
        title: '',
        description: '',
      };
      const mockId = '123';
      const result = {};

      expect(await hotelRoomService.update(mockId, mockData)).toStrictEqual(
        result,
      );
    });

    it('should return null', async () => {
      const mockData: TUpdateHotelRoomData = {
        title: '',
        description: '',
        images: [],
      };
      const mockId = '';
      const result = null;

      expect(await hotelRoomService.update(mockId, mockData)).toBe(result);
    });
  });
});
