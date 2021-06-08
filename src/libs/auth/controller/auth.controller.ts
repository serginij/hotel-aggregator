import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from 'src/libs/user/dto/user.dto';
import { AuthService } from '../core/auth.service';
import { LoginUserDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post('register')
  async register(@Body() registerUserDto: CreateUserDto) {
    const res = await this.authService.register(registerUserDto);

    if (res === null) throw new InternalServerErrorException();

    return res;
  }
}
