import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from 'src/common/common.types';
import { BcryptService } from 'src/utils/bcrypt/bcrypt.service';

import { UserDto } from '../dto/user.dto';
import { SearchUserParams, TBaseUserInfo } from '../interface/user.interface';
import { User } from '../model/user.model';
import { UserStore } from '../store/user.store';

type ConditionalUserModel<B> = B extends true ? User : TBaseUserInfo;

interface IUserService {
  create(data: Partial<User>): Promise<User | null>;
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

  // Create user if given email does not exists
  create = async (user: UserDto) => {
    const { password, role, ...userData } = user;

    const userExists = await this.userStore.findUserByEmail(user.email);

    if (userExists) return null;

    const encryptedPassword = await this.bcryptService.encryptPassword(
      password,
    );

    return await this.userStore.createUser({
      ...userData,
      passwordHash: encryptedPassword,
      role: role ?? RoleEnum.CLIENT,
    });
  };

  // Find user by id
  findById = async (id: string) => {
    const user = await this.userStore.findUserById(id);

    if (user) {
      const { passwordHash, role, ...data } = user;

      return data;
    }

    return null;
  };

  // Find user by email
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

  // Find all users
  findAll = async (params: SearchUserParams) => {
    const users = await this.userStore.findAllUsers(params);

    return users.map(({ passwordHash, ...user }) => user);
  };
}
