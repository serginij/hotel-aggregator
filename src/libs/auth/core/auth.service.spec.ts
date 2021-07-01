import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { RoleEnum } from 'src/common/common.types';
import { UserDto } from '../../user/dto/user.dto';
import { UtilsModule } from 'src/utils/utils.module';

import { AuthService } from './auth.service';
import {
  SearchUserParams,
  TFullUserInfo,
} from 'src/libs/user/interface/user.interface';
import { UserStore } from 'src/libs/user/store/user.store';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/libs/user/core/user.service';
import { BcryptService } from 'src/utils/bcrypt/bcrypt.service';
import { LoginUserDto } from '../dto/auth.dto';

describe('AuthService', () => {
  let authService: AuthService;

  const fakeUser: TFullUserInfo = {
    id: '60ca5qa4b5dc5b031efabcfe' as any,
    email: 'test',
    name: 'user',
    contactPhone: undefined,
    role: RoleEnum.CLIENT,
    passwordHash: '',
  };

  const fakeToken = {
    expiresIn: 3600,
    token: 'token',
  };

  const MockModel = () => ({
    findAllUsers: ({ email }: SearchUserParams) =>
      email === 'test' ? [fakeUser] : [],
    createUser: ({ role, contactPhone }: UserDto) =>
      contactPhone === '123'
        ? null
        : {
            ...fakeUser,
            role: role ?? RoleEnum.CLIENT,
          },
    findUserById: (id: string) => (id === 'test' ? fakeUser : null),
    findUserByEmail: (email: string) =>
      email === 'test' ? fakeUser : undefined,
  });

  const MockBcrypt = () => ({
    decryptPassword: (hash, pass) => hash === pass,
    encryptPassword: (pass) => pass,
  });

  const MockJwt = () => ({
    sign: () => 'token',
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        UtilsModule,
        PassportModule,
        JwtModule.register({
          secret: 'secret',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(UserStore),
          useFactory: MockModel,
        },
        {
          provide: BcryptService,
          useFactory: MockBcrypt,
        },
        { provide: JwtService, useFactory: MockJwt },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user', async () => {
      const mockData = {
        email: 'test',
        password: '',
      };

      const result = {
        id: '60ca5qa4b5dc5b031efabcfe',
        email: 'test',
        name: 'user',
        contactPhone: undefined,
        role: RoleEnum.CLIENT,
      };

      expect(
        await authService.validateUser(mockData.email, mockData.password),
      ).toStrictEqual(result);
    });

    it('should return null', async () => {
      const mockData = {
        email: 'test',
        password: '123',
      };

      const result = null;

      expect(
        await authService.validateUser(mockData.email, mockData.password),
      ).toBe(result);
    });

    it('should return null', async () => {
      const mockData = {
        email: '',
        password: '',
      };
      const result = null;

      expect(
        await authService.validateUser(mockData.email, mockData.password),
      ).toBe(result);
    });
  });

  describe('register', () => {
    it('should return CLIENT user ', async () => {
      const mockData: UserDto = {
        email: 'qw',
        name: 'user',
        contactPhone: undefined,
        password: '',
      };

      const result = {
        id: '60ca5qa4b5dc5b031efabcfe' as any,
        email: 'test',
        name: 'user',
        contactPhone: undefined,
        role: RoleEnum.CLIENT,
        passwordHash: '',
      };

      expect(await authService.register(mockData)).toStrictEqual(result);
    });

    it('should return MANAGER user ', async () => {
      const mockData: UserDto = {
        email: 'qw',
        name: 'user',
        contactPhone: undefined,
        password: '',
        role: RoleEnum.MANAGER,
      };

      const result = {
        id: '60ca5qa4b5dc5b031efabcfe' as any,
        email: 'test',
        name: 'user',
        contactPhone: undefined,
        role: RoleEnum.CLIENT,
        passwordHash: '',
      };

      expect(await authService.register(mockData)).toStrictEqual(result);
    });

    it('should return null', async () => {
      const mockData: UserDto = {
        email: 'test',
        name: 'user',
        contactPhone: '12432',
        password: '',
      };

      const result = null;

      expect(await authService.register(mockData)).toStrictEqual(result);
    });
  });

  describe('login', () => {
    it('should return token', async () => {
      const mockData: LoginUserDto = {
        email: 'test',
        password: '',
      };

      const result = fakeToken;

      expect(await authService.login(mockData)).toStrictEqual(result);
    });

    it('should return null', async () => {
      const mockData: LoginUserDto = {
        email: 'test',
        password: '123',
      };

      const result = null;

      expect(await authService.login(mockData)).toStrictEqual(result);
    });

    it('should return null', async () => {
      const mockData = { email: 'tes1', password: '' };
      const result = null;

      expect(await authService.login(mockData)).toStrictEqual(result);
    });
  });
});
