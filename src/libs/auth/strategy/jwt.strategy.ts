import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/libs/user/core/user.service';
import { IJwtPayload } from '../interface/auth.interface';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET_KEY,
    });
  }

  validate = async (payload: IJwtPayload) => {
    console.log({ payload });

    const user = await this.userService.findByEmail(payload.email, {
      fullModel: true,
    });

    if (!user) throw new UnauthorizedException();

    console.log({ user });

    const { role, id, email } = user;

    return { id, role, email };
  };
}
