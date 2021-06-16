import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
  Get,
  Query,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoleEnum } from 'src/common/common.types';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { UserService } from '../core/user.service';
import { SearchUserQuery, UserDto } from '../dto/user.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(RoleEnum.ADMIN)
  @Post('admin')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() data: UserDto) {
    const user = await this.userService.create(data);

    if (user === null)
      throw new BadRequestException('User with given email exists');

    if (!user)
      throw new InternalServerErrorException(
        'An error occured while creating user',
      );

    return user;
  }

  @Roles(RoleEnum.ADMIN)
  @Get('admin')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAdminUsers(@Query() params: SearchUserQuery) {
    return await this.userService.findAll(params);
  }

  @Roles(RoleEnum.MANAGER)
  @Get('manager')
  @UsePipes(new ValidationPipe())
  async getUsers(@Query() params: SearchUserQuery) {
    return await this.userService.findAll(params);
  }
}
