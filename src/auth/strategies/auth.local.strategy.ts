import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // usernaem 키 이름 변경 user_id로 요청
    super({
      usernameField: 'user_id',
      passwordField: 'user_password',
    });
  }

  async validate(user_id: string, user_password: string): Promise<any> {
    const user = await this.authService.validateUser(user_id, user_password);

    if (!user) {
      throw new UnauthorizedException({
        error: '아이디와 패스워드가 정확하지 않습니다.',
      });
    }

    return user;
  }
}
