import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/libs/user/dto/user.dto';
import { AuthService } from '../core/auth.service';
import { LoginUserDto } from '../dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO: add cookie to response, check why res is empty
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() response: Response) {
    const res = await this.authService.login(loginUserDto);
    if (!res) throw new BadRequestException();

    const { token, expiresIn } = res;
    response.cookie('auth-token', token, {
      maxAge: expiresIn,
      httpOnly: true,
    });
    response.status(200).json(res);
  }

  @Post('register')
  async register(@Body() registerUserDto: CreateUserDto) {
    const res = await this.authService.register(registerUserDto);

    if (res === null) throw new InternalServerErrorException();

    return res;
  }
}
