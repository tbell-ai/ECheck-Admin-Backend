import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      //Request에서 JWT 토큰을 추출하는 방법을 설정 -> Authorization에서 Bearer Token에 JWT 토큰을 담아 전송해야한다.
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.LOGIN_TOKEN;
        },
      ]),
      //true로 설정하면 Passport에 토큰 검증을 위임하지 않고 직접 검증, false는 Passport에 검증 위임
      ignoreExpiration: false,
      //검증 비밀 값(유출 주위)
      secretOrKey: jwtConstants.secret,
    });
  }

  /**
   * @author 박현진 팀장
   * @description 클라이언트가 전송한 Jwt 토큰 정보를 검증
   *
   * @param payload 토큰 전송 내용
   */
  async validate(payload: any) {
    try {
      const user = await this.userService.findByUserOne(payload.user_id);
      if (user === null || user === undefined) {
        throw new UnauthorizedException({
          error: '일치하는 회원이 없습니다.',
        });
      }
      return { user };
    } catch (err) {
      throw new Error('서버 오류입니다.');
    }
  }
}
