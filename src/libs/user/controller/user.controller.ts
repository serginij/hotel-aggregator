import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleEnum } from 'src/common/common.types';

import { Roles } from 'src/common/decorators/roles.decorator';

import { UserService } from '../core/user.service';
import { UserDto } from '../dto/user.dto';
import { SearchUserParams } from '../interface/user.interface';

@UseGuards(AuthGuard())
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: check if ROLE === admin
  @Roles(RoleEnum.ADMIN)
  @Post('admin/users')
  async createUser(@Body() data: UserDto) {
    const user = await this.userService.create(data);

    if (!user)
      throw new InternalServerErrorException(
        'An error occured while creating user',
      );

    return user;
  }

  // TODO: check if ROLE === admin
  @Roles(RoleEnum.ADMIN)
  @Get('admin/users')
  async getAdminUsers(@Query() params: SearchUserParams) {
    return await this.userService.findAll(params);
  }

  // TODO: check if ROLE === manager
  @Roles(RoleEnum.MANAGER)
  @Get('manager/users')
  async getUsers(@Query() params: SearchUserParams) {
    return await this.userService.findAll(params);
  }
}
