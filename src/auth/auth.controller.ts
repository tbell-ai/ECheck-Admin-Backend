import {
  Controller,
  Request,
  Res,
  Post,
  UseGuards,
  HttpStatus,
  UnauthorizedException,
  HttpException,
  Param,
  ParseUUIDPipe,
  Get,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthService } from './auth.service';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-auth-refresh.guard';
import { SignInDto } from 'src/user/dto/user.dto';

@Controller('auth')
@ApiTags('Auth') // Swagger Tage 설정
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * @author 박현진 팀장
   * @description 로그인, 최초 로그인에서는 LocalAuthGuard를 호출, LocalAuthGuard가 자동으로 validateUser를 호출함
   *
   * @param req 요청 객체
   *
   * @returns {Response}
   */
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: '로그인 API',
    description: '아이디와 비밀번호를 통해 로그인을 진행',
  })
  @ApiCreatedResponse({
    description: '로그인 정보',
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          user_idx: 'cea1d926-6f1b-4a37-a46c-8ddf0b17a0bc',
          user_id: 'test1234',
          user_nickname: 'hj.park',
          user_email: 'hj.park@tbell.co.kr',
          user_role: 'user',
          login_date: '2021-12-25T23:30:51.371Z',
          login_ip: '192.168.0.1',
          login_device: 'Android',
        },
      },
    },
  })
  async login(
    @Request() req,
    @Res() res: Response,
    @Body() signInDto: SignInDto,
  ) {
    const { user } = req;
    const userAgent = req.headers['user-agent'];
    const remoteIpAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (user) {
      const payload = {
        user_idx: user.user_idx,
        user_id: user.user_id,
        user_nickname: user.user_nickname,
        user_role: user.user_role,
      };

      const accessTokenCookie =
        this.authService.getCookieWithJwtAccessToken(payload);

      const { cookie: refreshTokenCookie, token: refreshToken } =
        this.authService.getCookieWithJwtRefreshToken(payload);

      const loginUsernameCookie =
        this.authService.getCookieWithLoginUserId(payload);

      await this.userService.setCurrentRefreshToken(
        refreshToken,
        user.user_idx,
      );

      const loginUser = await this.userService.setUserLastLoginData(
        remoteIpAddress,
        userAgent,
        user.user_idx,
      );

      // 반드시 req.res로 쿠키를 설정해야 한다.
      req.res.setHeader('Set-Cookie', [
        ...accessTokenCookie,
        refreshTokenCookie,
        loginUsernameCookie,
      ]);

      // DB 상에는 AccessToken은 저장되지 않음, Refresh Token은 Hash로 암호화되어 저장되므로 Refresh를 진행할 때 Hash로 암호화하여 비교해야 함
      const data = {
        user_idx: loginUser.user_idx,
        user_id: loginUser.user_id,
        user_nickname: loginUser.user_nickname,
        user_email: loginUser.user_email,
        user_role: loginUser.user_role,
        login_date: loginUser.user_last_login_date,
        login_device: loginUser.user_last_login_device,
        login_ip: loginUser.user_last_login_ip,
      };

      return res.status(HttpStatus.OK).json({
        code: '0000',
        message: '정상 처리되었습니다.',
        result: data,
      });
    } else {
      throw new UnauthorizedException({
        message: '해당하는 정보를 가진 회원이 없습니다.',
      });
    }
  }

  /**
   * @author 박현진 팀장
   * @description 로그인한 회원의 로그아웃 진행
   *
   * @param req       요청 객체
   * @param user_idx  요청 객체
   *
   * @returns {Response}
   */
  @Get('/logout/:idx')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '로그아웃 API',
    description: '로그인한 회원이 로그아웃을 진행',
  })
  @ApiCreatedResponse({
    description: '로그아웃 결과',
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: true,
      },
    },
  })
  async logout(
    @Res() res: Response,
    @Param('idx', ParseUUIDPipe) user_idx: string,
  ) {
    return await this.userService
      .removeRefreshToken(user_idx)
      .then(data => {
        res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
        res.status(HttpStatus.OK).json({
          code: '0000',
          message: '정상 처리되었습니다.',
          result: data,
        });
      })
      .catch(error => {
        throw new HttpException(
          {
            error: error,
            message: '로그아웃 처리에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  @Get('/refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiCookieAuth('REFRESH_LOGIN_TOKEN')
  @ApiOperation({
    summary: '인증 리플래쉬 API',
    description: '만료된 인증 정보를 리플래쉬한다.',
  })
  @ApiCreatedResponse({
    description: '인증 정보',
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          user_idx: 'cea1d926-6f1b-4a37-a46c-8ddf0b17a0bc',
          user_id: 'test1234',
          user_nickname: 'hj.park',
          user_email: 'hj.park@tbell.co.kr',
          user_role: 'user',
          login_date: '2021-12-25T23:30:51.371Z',
          login_ip: '192.168.0.1',
          login_device: 'Android',
        },
      },
    },
  })
  async refresh(@Request() req, @Res() res: Response) {
    const payload = {
      user_idx: req.user.user_idx,
      user_id: req.user.user_id,
      user_nickname: req.user.user_nickname,
      user_role: req.user.user_role,
    };

    if (req.user) {
      const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
        payload,
        true,
      );
      req.res.setHeader('Set-Cookie', accessTokenCookie);
      return res.status(HttpStatus.OK).json({
        code: '0000',
        message: '정상 처리되었습니다.',
        data: req.user,
      });
    } else {
      throw new UnauthorizedException({
        message: '해당하는 정보를 가진 회원이 없습니다.',
      });
    }
  }
}
