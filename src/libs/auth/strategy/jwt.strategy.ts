import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/libs/user/core/user.service';
import { IJwtPayload } from '../interface/auth.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  validate = async (payload: IJwtPayload) => {
    const user = await this.userService.findByEmail(payload.email, {
      fullModel: true,
    });

    if (!user) throw new UnauthorizedException();

    const { role, id, email } = user;

    return { id, role, email };
  };
}
