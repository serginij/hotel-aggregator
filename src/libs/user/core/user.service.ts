import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptService } from 'src/src/utils/bcrypt/bcrypt.service';

import { UserDto } from '../dto/user.dto';
import { SearchUserParams, TBaseUserInfo } from '../interface/user.interface';
import { User } from '../model/user.model';
import { UserStore } from '../store/user.store';

interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: string): Promise<TBaseUserInfo | null>;
  findByEmail(email: string): Promise<TBaseUserInfo | null>;
  findAll(params: SearchUserParams): Promise<TBaseUserInfo[] | null>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserStore) private readonly userStore: UserStore,
    private readonly bcryptService: BcryptService,
  ) {}

  create = async (user: UserDto) => {
    const { password, ...userData } = user;

    const encryptedPassword = await this.bcryptService.encryptPassword(
      password,
    );

    return await this.userStore.createUser({
      ...userData,
      password: encryptedPassword,
    });
  };

  validate = async (email: string, pass: string) => {
    const user = await this.userStore.findUserByEmail(email);

    if (user) {
      const { passwordHash, ...result } = user;
      const isEquals = await this.bcryptService.decryptPassword(
        pass,
        passwordHash,
      );

      if (isEquals) return result;
    }
    return null;
  };

  findById = async (id: string) => {
    const user = await this.userStore.findUserById(id);

    if (user) {
      const { passwordHash, role, ...data } = user;

      return data;
    }

    return null;
  };

  findByEmail = async (email: string) => {
    const user = await this.userStore.findUserByEmail(email);

    if (user) {
      const { passwordHash, role, ...data } = user;

      return data;
    }

    return null;
  };

  findAll = async (params: SearchUserParams) => {
    const users = await this.userStore.findAllUsers(params);

    if (users) {
      return users.map(({ passwordHash, ...user }) => user);
    }

    return null;
  };
}
