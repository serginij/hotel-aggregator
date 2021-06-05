import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  Get,
  Query,
} from '@nestjs/common';

import { UserService } from '../core/user.service';
import { UserDto } from '../dto/user.dto';
import { SearchUserParams } from '../interface/user.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: check if ROLE === admin
  @Post('/admin/users')
  async createUser(@Body() data: UserDto) {
    const user = await this.userService.create(data);

    if (!user)
      throw new InternalServerErrorException(
        'An error occured while creating user',
      );

    return user;
  }

  // TODO: check if ROLE === admin
  @Get('/admin/users')
  async getAdminUsers(@Query() params: SearchUserParams) {
    return await this.userService.findAll(params);
  }

  // TODO: check if ROLE === manager
  @Get('/manager/users')
  async getUsers(@Query() params: SearchUserParams) {
    return await this.userService.findAll(params);
  }
}
