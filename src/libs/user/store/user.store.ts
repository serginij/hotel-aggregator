import { EntityRepository, Like, Repository } from 'typeorm';

import { User } from '../model/user.model';
import { UserDto } from '../dto/user.dto';
import { SearchUserParams } from '../interface/user.interface';

interface IUserStore {
  createUser: (userDto: UserDto) => Promise<User | undefined>;
  findUserByEmail: (email: string) => Promise<User | undefined>;
  findUserById: (id: string) => Promise<User | undefined>;
  findAllUsers: (params: SearchUserParams) => Promise<User[] | undefined>;
}

@EntityRepository(User)
export class UserStore extends Repository<User> implements IUserStore {
  createUser = async (userDto: UserDto) => {
    return await this.save(userDto);
  };

  findUserByEmail = async (email: string) => {
    return await this.findOne({ email });
  };

  findUserById = async (id: string) => {
    return await this.findOne(id);
  };

  findAllUsers = async (params: SearchUserParams) => {
    const { limit, offset, name, email, contactPhone } = params;

    return await this.find({
      skip: offset,
      take: limit,
      where: {
        name: Like(name),
        email: Like(email),
        contactPhone: Like(contactPhone),
      },
    });
  };
}
