import { Injectable } from '@nestjs/common';
import { UserService } from 'src/libs/user/core/user.service';
import { CreateUserDto, UserDto } from 'src/libs/user/dto/user.dto';
import { BcryptService } from 'src/utils/bcrypt/bcrypt.service';
import { IJwtPayload } from '../interface/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../dto/auth.dto';
import { RoleEnum } from 'src/common/common.types';

const JWT_TOKEN_TTL = Number(process.env.JWT_TOKEN_TTL || 3600);

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  validateUser = async (email: string, pass: string) => {
    const user = await this.userService.findByEmail(email, { fullModel: true });

    if (user) {
      const { passwordHash, ...result } = user;
      const isEquals = await this.bcryptService.decryptPassword(
        passwordHash,
        pass,
      );

      if (isEquals) return result;
    }
    return null;
  };

  register = async (userDto: CreateUserDto) => {
    const user = await this.userService.create({
      ...userDto,
      role: RoleEnum.CLIENT,
    });

    if (!user) return null;

    return user;
  };

  private generateToken = ({ email, name, contactPhone, role }: UserDto) => {
    const user: IJwtPayload = {
      email,
      name,
      contactPhone,
      role: role || RoleEnum.CLIENT,
    };

    const token = this.jwtService.sign(user);

    return {
      expiresIn: JWT_TOKEN_TTL,
      token,
    };
  };

  login = async (loginDto: LoginUserDto) => {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);

    if (!user) return null;

    const token = this.generateToken(user as any);

    return token;
  };
}
