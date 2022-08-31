import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from '../auth/constants';
import { TokenPayload } from './auth.payload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * @author 박현진 팀장
   * @description local-strategy 방식 로그인
   *
   * @param user_id   로그인 시도한 회원 아이디
   * @param password  로그인 시도한 회원 비밀번호
   *
   * @returns User
   */
  async validateUser(user_id: string, pass: string): Promise<any> {
    const user = await this.userService.findByUserOne(user_id);

    //사용자가 요청한 비밀번호와 DB에서 조회한 비밀번호 일치여부 검사
    const password = await bcrypt.compare(pass, user.user_password);
    if (password) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * @author 박현진 팀장
   * @description jwt-strategy 방식 로그인 과정 중에 TokenPayload를 통하여 AccessToken을 생성한다.
   *
   * @param payload           로그인을 시도한 회원 정보를 담은 Payload 객체
   * @param hasAuthorization  인증한 이력을 체크하는 플래그 필드
   *
   * @returns [Cookie Array] token 값을 셋팅한 Cookie
   */
  getCookieWithJwtAccessToken(payload: TokenPayload, hasAuthorization = false) {
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret || 'tbell0518',
      expiresIn: jwtConstants.expriration_time || '3d',
    });

    if (hasAuthorization) {
      return [
        `LOGIN_TOKEN=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.expriration_time}; Secure; SameSite=None`,
        `Authorization=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.expriration_time}; Secure; SameSite=None`,
      ];
    } else {
      return [
        // https 보안 적용 후 쿠키
        `LOGIN_TOKEN=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.expriration_time}; Secure; SameSite=None`,
        // `LOGIN_TOKEN=${token}; Path=/; Max-Age=${jwtConstants.expriration_time}`,
      ];
    }
  }

  /**
   * @author 박현진 팀장
   * @description jwt-strategy 방식 로그인 과정 중에 TokenPayload를 통하여 RefreshToken을 생성한다.
   *
   * @param payload 로그인을 시도한 회원 정보를 담은 Payload 객체
   *
   * @returns {Cookie String, Token String} token 값을 셋팅한 Cookie와 생성한 Refresh Token
   */
  getCookieWithJwtRefreshToken(payload: TokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.refresh_secret || 'tbell0518',
      expiresIn: jwtConstants.refresh_expriration_time || '7d',
    });

    // https 보안 적용 후 쿠키
    const cookie = `REFRESH_LOGIN_TOKEN=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.refresh_expriration_time}; Secure; SameSite=None`;

    // const cookie = `REFRESH_LOGIN_TOKEN=${token}; Path=/; Max-Age=${jwtConstants.refresh_expriration_time}`;

    return {
      cookie,
      token,
    };
  }

  /**
   * @author 박현진 팀장
   * @description jwt-strategy 방식 로그인 과정 중에 TokenPayload에 있는 user_id 정보를 담은 Cookie String을 생성한다.
   *
   * @param payload           로그인을 시도한 회원 정보를 담은 Payload 객체
   *
   * @returns 'Cookie String' 로그인을 시도한 회원의 user_id 정보값을 셋팅한 Cookie
   */
  getCookieWithLoginUserId(payload: TokenPayload) {
    // https 보안 적용 후 쿠키
    return `LOGIN_USER_ID=${payload.user_id}; HttpOnly; Path=/; Max-Age=${jwtConstants.refresh_expriration_time}; Secure; SameSite=None`;
    // return `LOGIN_USER_ID=${payload.user_id}; Path=/; Max-Age=${jwtConstants.refresh_expriration_time}`;
  }

  /**
   * @author 박현진 팀장
   * @description jwt-strategy 방식으로 로그인한 회원이 로그아웃하는 경우 Cookie를 초기화 한다.
   *   *
   * @returns [Cookie Array] token과 user_id, expriration_time을 초기화 한 Cookie
   */
  getCookiesForLogOut() {
    return [
      'LOGIN_TOKEN=; HttpOnly; Path=/; Max-Age=0',
      'REFRESH_LOGIN_TOKEN=; HttpOnly; Path=/; Max-Age=0',
      'LOGIN_USER_ID=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
