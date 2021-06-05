import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptService } from 'src/src/utils/bcrypt/bcrypt.service';

import { UserDto } from '../dto/user.dto';
import { SearchUserParams, TBaseUserInfo } from '../interface/user.interface';
import { User } from '../model/user.model';
import { UserStore } from '../store/user.store';

type ConditionalUserModel<B> = B extends true ? User : TBaseUserInfo;

interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: string): Promise<TBaseUserInfo | null>;
  findByEmail<B extends true>(
    email: string,
    options?: { fullModel: B },
  ): Promise<ConditionalUserModel<B> | null>;
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

  findById = async (id: string) => {
    const user = await this.userStore.findUserById(id);

    if (user) {
      const { passwordHash, role, ...data } = user;

      return data;
    }

    return null;
  };

  findByEmail = async <B extends boolean>(
    email: string,
    options?: { fullModel: B },
  ): Promise<ConditionalUserModel<B> | null> => {
    const user = await this.userStore.findUserByEmail(email);

    if (user) {
      if (options?.fullModel) return user as ConditionalUserModel<B>;

      const { passwordHash, role, ...data } = user;

      return data as ConditionalUserModel<B>;
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
