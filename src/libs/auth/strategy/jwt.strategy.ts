import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/libs/user/core/user.service';
import { IJwtPayload } from '../interface/auth.interface';
import { AuthService } from '../core/auth.service';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET_KEY,
    });
  }

  public async validate(payload: IJwtPayload) {
    const user = await this.userService.findByEmail(payload.email);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
