import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  Query,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  UseGuards,
  HttpStatus,
  Res,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, StateDto, UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from './user.entity';

@Controller('user')
@ApiTags('User') // Swagger Tage 설정
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @author 박현진 팀장
   * @description 신규 회원을 생성합니다.
   *
   * @param res           응답 객체
   * @param createUserDto 신규 생성 유저 객체
   */
  @Post('/create_user')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: '회원가입 API',
    description: '신규 회원을 생성합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          user_idx: '94c8fdb8-5cfe-4f69-a5b....',
          user_id: 'test1234',
        },
      },
    },
  })
  async onCreateUser(
    @Res() res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    await this.userService
      .onCreateUser(createUserDto)
      .then(data => {
        res.status(HttpStatus.OK).json({
          code: '0000',
          message: '정상 처리되었습니다.',
          result: {
            user_idx: data.user_idx,
            user_id: data.user_id,
          },
        });
      })
      .catch(error => {
        throw new HttpException(
          {
            error: error,
            message: '신규 사용자 생성에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 신규 회원 가입자의 아이디 중복을 체크합니다.
   *
   * @param res       응답 객체
   * @param user_id   중복 체크 대상 ID
   */
  @Get('/check_user')
  @ApiOperation({
    summary: '회원 아이디 중복 체크 API',
    description: '신규 회원 가입자의 아이디 중복을 체크합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: true,
      },
    },
  })
  async checkUserId(@Res() res: Response, @Query('user_id') user_id: string) {
    await this.userService
      .checkUserId(user_id)
      .then(data => {
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
            message: '중복 회원 조회에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전체 회원의 목록을 조회합니다.
   *
   * @param request   요청 객체
   * @param res       응답 객체
   */
  @Get('/user_all')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '회원 목록 조회 API',
    description:
      '전체 회원의 목록을 조회합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        results: [
          {
            user_idx: 'b0d35c0b-b705-489f-a4f6-efd1e3c31f46',
            user_id: 'test111',
            user_nickname: 'test123',
            user_email: 'hj.park@tbell.co.kr',
            user_create_date: '2022-07-26T06:38:57.090Z',
          },
          {
            user_idx: '84f826dc-5fe5-4825-ad18-61ac2357fe30',
            user_id: 'tbell123',
            user_nickname: 'test',
            user_email: 'abck@tbell.co.kr',
            user_create_date: '2022-07-19T04:42:01.921Z',
          },
        ],
        pageTotal: 2,
        total: 2,
      },
    },
  })
  async getUserList(
    @Request() req,
    @Res() res: Response,
    @Query('take') take: number,
    @Query('page') page: number,
    @Query('type') type: string,
  ) {
    return await this.userService
      .getUserAll(
        {
          take: take ? take : 10,
          page: page ? page : 1,
        },
        type ? type : 'active',
      )
      .then(data => {
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
            message: '회원 목록 조회에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 대상 회원의 상세 정보를 조회합니다.
   *
   * @param user_idx  회원의 고유 번호
   * @param res       응답 객체
   */
  @Get('/read_user')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '회원 정보 조회 API',
    description: '대상 회원의 상세 정보를 조회합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          user_idx: 'cea1d926-6f1b-4a37-a46c-8ddf0b17a0bc',
          user_id: 'test1234',
          user_nickname: 'tester',
          user_email: 'hj.park@tbell.co.kr',
          user_email_yn: 1,
          user_term_yn: 1,
          user_collection_yn: 1,
          user_privacy_yn: 1,
          user_last_login_ip: '192.168.0.1',
          user_last_login_device: 'Android',
          user_last_login_date: '2022-05-25T23:30:51.371Z',
          user_state: 'active',
          user_create_date: '2022-05-25T23:30:51.371Z',
          user_last_modify_date: '2022-05-25T23:30:51.371Z',
        },
      },
    },
  })
  async getOneUser(
    @Query('idx', ParseUUIDPipe) user_idx: string,
    @Res() res: Response,
  ) {
    return await this.userService
      .readByUserOne(user_idx)
      .then(data => {
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
            message: '회원 정보 조회에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 회원의 권한을 변경합니다.
   *
   * @param res     응답 객체
   * @param state   변경 상태 값
   */
  @Patch('/update_role/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '회원 권한 변경 API',
    description:
      '회원의 권한을 변경합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: true,
      },
    },
  })
  async editUserRole(
    @Param('idx', ParseUUIDPipe) user_idx: string,
    @Res() res: Response,
  ) {
    await this.userService
      .editUserRole(user_idx)
      .then(data => {
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
            message: '회원 상태 변경에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 회원의 상태를 변경합니다.
   *
   * @param res     응답 객체
   * @param state   변경 상태 값
   */
  @Patch('/update_state')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '회원 상태 변경 API',
    description:
      '회원의 상태를 변경합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: true,
      },
    },
  })
  async editUserState(@Res() res: Response, @Body() state: StateDto) {
    await this.userService
      .editUserState(state)
      .then(data => {
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
            message: '회원 상태 변경에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 대상 회원의 정보를 수정합니다.
   *
   * @param user_idx          회원 고유번호
   * @param user_nickname     회원 수정 데이터
   * @param res               응답 객체
   */
  @Patch('/update_user/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '회원 정보 수정 API',
    description:
      '대상 회원의 정보(닉네임, 패스워드, 이메일)를 수정합니다. 수정값이 없을 경우 공백 전달',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: true,
      },
    },
  })
  async editUser(
    @Param('idx', ParseUUIDPipe) user_idx: string,
    @Body() updateDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    return await this.userService
      .updateUser(user_idx, updateDto)
      .then(data => {
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
            message: '회원 정보 수정에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 대상 회원의 이메일 인증 여부 정보를 완료로 수정합니다.
   *
   * @param user_idx          회원 고유번호
   * @param res               응답 객체
   */
  @Patch('/update_email_yn/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '회원 이메일 인증 여부 정보 수정 API',
    description: '대상 회원의 이메일 인증 여부 정보를 인증 완료로 수정합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: true,
      },
    },
  })
  async editUserEmailYn(
    @Param('idx', ParseUUIDPipe) user_idx: string,
    @Res() res: Response,
  ) {
    return await this.userService
      .updateUserEmailYn(user_idx)
      .then(data => {
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
            message: '회원 정보 수정에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 회원 탈퇴 대상 회원의 상태와 사용유무 정보를 변경합니다.
   *
   * @param user_idx     대상 회원의 고유 번호
   * @param res          응답 객체
   */
  @Delete('/delete_user/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '회원 탈퇴 API',
    description:
      '회원의 상태와 사용유무를 업데이트하여 탈퇴 처리를 진행합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: true,
      },
    },
  })
  async deleteUser(
    @Param('idx', ParseUUIDPipe) user_idx: string,
    @Res() res: Response,
  ) {
    return await this.userService
      .updateUserStateAndEnabled(user_idx)
      .then(data => {
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
            message: '회원 탈퇴 처리에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 대상 회원을 삭제합니다.
   *
   * @param user_idx     대상 회원의 고유 번호
   * @param res          응답 객체
   */
  @Delete('/remove_user')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '회원 삭제 API',
    description:
      '탈퇴회원 상태인 회원의 개인정보 보관 기간이 도래하여 삭제를 진행합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: true,
      },
    },
  })
  async removeUser(
    @Query('user_idx', ParseUUIDPipe) user_idx: string,
    @Res() res: Response,
  ) {
    return await this.userService
      .deleteUser(user_idx)
      .then(data => {
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
            message: '회원 삭제 처리에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  // 다중 회원 수정 필요(일괄 수정, 배치용)
  // 다중 회원 삭제 필요(일괄 삭제, 배치용)
}
