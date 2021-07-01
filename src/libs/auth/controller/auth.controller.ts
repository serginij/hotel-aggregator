import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/libs/user/dto/user.dto';
import { AuthService } from '../core/auth.service';
import { LoginUserDto } from '../dto/auth.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async helloWorld() {
    return 'Hello world';
  }

  // GET /api/v1/auth/me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    console.log(req.user);
    return req.user;
  }

  // POST /api/v1/auth/login
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

  // POST /api/v1/auth/register
  @Post('register')
  async register(@Body() registerUserDto: CreateUserDto) {
    const res = await this.authService.register(registerUserDto);

    if (res === null) throw new InternalServerErrorException();

    return res;
  }
}
