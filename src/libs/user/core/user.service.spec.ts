import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { SearchUserParams, TFullUserInfo } from '../interface/user.interface';

import { UserStore } from '../store/user.store';

import { UserService } from './user.service';

import { RoleEnum } from 'src/common/common.types';
import { UserDto } from '../dto/user.dto';
import { UtilsModule } from 'src/utils/utils.module';

describe('UserService', () => {
  let userService: UserService;

  const fakeUser: TFullUserInfo = {
    id: '60ca5qa4b5dc5b031efabcfe' as any,
    email: 'test',
    name: 'user',
    contactPhone: undefined,
    role: RoleEnum.CLIENT,
    passwordHash: '',
  };

  const MockModel = () => ({
    findAllUsers: ({ email }: SearchUserParams) =>
      email === 'test' ? [fakeUser] : [],
    createUser: ({ role }: UserDto) => ({
      ...fakeUser,
      role: role ?? RoleEnum.CLIENT,
    }),
    findUserById: (id: string) => (id === 'test' ? fakeUser : null),
    findUserByEmail: (email: string) =>
      email === 'test' ? fakeUser : undefined,
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UtilsModule],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserStore),
          useFactory: MockModel,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should return user', async () => {
      const mockData: UserDto = {
        email: '',
        password: '',
        name: '',
        role: RoleEnum.MANAGER,
      };
      const result = {
        id: '60ca5qa4b5dc5b031efabcfe',
        email: 'test',
        name: 'user',
        contactPhone: undefined,
        role: RoleEnum.MANAGER,
        passwordHash: '',
      };

      expect(await userService.create(mockData)).toStrictEqual(result);
    });

    it('should return client user', async () => {
      const mockData: UserDto = {
        email: '',
        password: '',
        name: '',
      };
      const result = {
        id: '60ca5qa4b5dc5b031efabcfe',
        email: 'test',
        name: 'user',
        contactPhone: undefined,
        role: RoleEnum.CLIENT,
        passwordHash: '',
      };

      expect(await userService.create(mockData)).toStrictEqual(result);
    });

    it('should return null', async () => {
      const mockData: UserDto = {
        email: 'test',
        password: '',
        name: '',
      };
      const result = null;

      expect(await userService.create(mockData)).toBe(result);
    });
  });

  describe('findById', () => {
    it('should return user ', async () => {
      const mockData = 'test';

      const result = {
        id: '60ca5qa4b5dc5b031efabcfe',
        email: 'test',
        name: 'user',
        contactPhone: undefined,
      };

      expect(await userService.findById(mockData)).toStrictEqual(result);
    });

    it('should return null', async () => {
      const mockData = '';
      const result = null;

      expect(await userService.findById(mockData)).toBe(result);
    });
  });

  describe('findByEmail', () => {
    it('should return base user info', async () => {
      const mockData = 'test';

      const result = {
        id: '60ca5qa4b5dc5b031efabcfe',
        email: 'test',
        name: 'user',
        contactPhone: undefined,
      };

      expect(await userService.findByEmail(mockData)).toStrictEqual(result);
    });

    it('should return all user info', async () => {
      const mockData = 'test';

      const result = {
        id: '60ca5qa4b5dc5b031efabcfe',
        email: 'test',
        name: 'user',
        contactPhone: undefined,
        role: RoleEnum.CLIENT,
        passwordHash: '',
      };

      expect(
        await userService.findByEmail(mockData, { fullModel: true }),
      ).toStrictEqual(result);
    });

    it('should return null', async () => {
      const mockData = '';
      const result = null;

      expect(await userService.findByEmail(mockData)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return base user info', async () => {
      const mockData: SearchUserParams = {
        limit: 10,
        offset: 1,
        email: 'test',
      };

      const result = [
        {
          id: '60ca5qa4b5dc5b031efabcfe',
          email: 'test',
          name: 'user',
          contactPhone: undefined,
          role: RoleEnum.CLIENT,
        },
      ];

      expect(await userService.findAll(mockData)).toStrictEqual(result);
    });

    it('should return empty array', async () => {
      const mockData: SearchUserParams = {
        limit: 10,
        offset: 1,
      };

      const result = [];

      expect(await userService.findAll(mockData)).toStrictEqual(result);
    });
  });
});
