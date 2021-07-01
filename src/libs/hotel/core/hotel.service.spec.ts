import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ID } from 'src/common/common.types';
import { HotelDto } from '../dto/hotel.dto';

import {
  SearchHotelParams,
  TCreateHotelData,
} from '../interface/hotel.interface';

import { HotelStore } from '../store/hotel.store';

import { HotelService } from './hotel.service';

describe('HotelService', () => {
  let hotelService: HotelService;

  const MockModel = () => ({
    updateHotel: (id: ID) => (id === '123' ? {} : null),
    createHotel: ({ title }: TCreateHotelData) => (title === '' ? {} : null),
    findHotelById: (id) => (id === '123' ? { title: '' } : null),
    findAllHotels: () => [],
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        HotelService,
        {
          provide: getRepositoryToken(HotelStore),
          useFactory: MockModel,
        },
      ],
    }).compile();

    hotelService = moduleRef.get<HotelService>(HotelService);
  });

  describe('create', () => {
    it('should return hotel', async () => {
      const mockData: HotelDto = {
        title: '',
        description: '',
      };
      const result = {};

      expect(await hotelService.create(mockData)).toStrictEqual(result);
    });

    it('should return null', async () => {
      const mockData: HotelDto = {
        title: '345',
        description: '',
      };
      const result = null;

      expect(await hotelService.create(mockData)).toBe(result);
    });
  });

  describe('findById', () => {
    it('should return hotel', async () => {
      const mockData = '123';
      const result = { title: '' };

      expect(await hotelService.findById(mockData)).toStrictEqual(result);
    });

    it('should return null', async () => {
      const mockData = '';
      const result = null;

      expect(await hotelService.findById(mockData)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all messages', async () => {
      const mockData: SearchHotelParams = {
        limit: 10,
        offset: 1,
        title: '',
      };
      const result = [];

      expect(await hotelService.findAll(mockData)).toStrictEqual(result);
    });
  });

  describe('update', () => {
    it('should return hotel', async () => {
      const mockData: HotelDto = {
        title: '',
        description: '',
      };
      const mockId = '123';
      const result = {};

      expect(await hotelService.update(mockId, mockData)).toStrictEqual(result);
    });

    it('should return null', async () => {
      const mockData: HotelDto = {
        title: '345',
        description: '',
      };
      const mockId = '';
      const result = null;

      expect(await hotelService.update(mockId, mockData)).toBe(result);
    });
  });
});
