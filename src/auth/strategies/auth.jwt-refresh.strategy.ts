import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { UserService } from '../../user/user.service';
import { jwtConstants } from '../constants';
import { User } from 'src/user/user.entity';
import { TokenPayload } from '../auth.payload';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.REFRESH_LOGIN_TOKEN;
        },
      ]),
      secretOrKey: jwtConstants.refresh_secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload): Promise<User> {
    const refreshToken = request.cookies?.REFRESH_LOGIN_TOKEN;
    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.user_idx as string,
    );
  }
}
