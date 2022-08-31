import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/auth.local.strategy';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/auth.jwt.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtRefreshTokenStrategy } from './strategies/auth.jwt-refresh.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      //토큰 서명 값 설정
      secret: jwtConstants.secret,
      //토큰 유효시간 (임의 60초)
      signOptions: { expiresIn: jwtConstants.expriration_time },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
