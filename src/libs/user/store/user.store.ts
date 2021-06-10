import { EntityRepository, Like, Repository } from 'typeorm';

import { User } from '../model/user.model';

import { SearchUserParams, TCreateUserData } from '../interface/user.interface';

interface IUserStore {
  createUser: (userDto: TCreateUserData) => Promise<User | undefined>;
  findUserByEmail: (email: string) => Promise<User | undefined>;
  findUserById: (id: string) => Promise<User | undefined>;
  findAllUsers: (params: SearchUserParams) => Promise<User[] | undefined>;
}

@EntityRepository(User)
export class UserStore extends Repository<User> implements IUserStore {
  createUser = async (userDto: TCreateUserData) => {
    const user = User.create(userDto);

    return await user.save();
  };

  findUserByEmail = async (email: string) => {
    return await User.findOne({ email });
  };

  findUserById = async (id: string) => {
    return await User.findOne(id);
  };

  findAllUsers = async (params: SearchUserParams) => {
    const { limit, offset, name, email, contactPhone } = params;

    return await User.find({
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
