import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { VersionService } from './version.service';
import { VersionDto, VersionUpdateDto } from './dto/version.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/user/user.entity';

@Controller('version')
@ApiTags('Version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  /**
   * @author 박현진 팀장
   * @description 신규 버전을 생성합니다.
   *
   * @param res         응답 객체
   * @param versionDto  신규 생성 버전 정보를 담은 객체
   */
  @Post('/create_version')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '버전생성 API',
    description: '신규 버전을 생성합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          version_idx: '94c8fdb8-5cfe-4f69-a5b....',
          version: '1.1.0',
        },
      },
    },
  })
  async onCreateVersion(@Res() res: Response, @Body() versionDto: VersionDto) {
    await this.versionService
      .onCreateVersion(versionDto)
      .then(data => {
        res.status(HttpStatus.OK).json({
          code: '0000',
          message: '정상 처리되었습니다.',
          result: {
            version_idx: data.version_idx,
            version: data.version_new,
          },
        });
      })
      .catch(error => {
        throw new HttpException(
          {
            error: error,
            message: '신규 버전 생성에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전체 버전의 목록을 조회합니다.
   *
   * @param request   요청 객체
   * @param res       응답 객체
   */
  @Get('/version_list')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '버전 목록 조회 API',
    description: '전체 버전의 목록을 조회합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: [
          {
            version_idx: 'cea1d926-6f1b-4a37-a46c-8ddf0b17a0bc',
            version_new: '2.3.0',
            version_detail: 'E-Check 신규 버전 출시, 버그 및 UIUX 개편',
            version_enabled: 1,
            version_create_date: '2022-05-25T23:30:51.371Z',
          },
        ],
      },
    },
  })
  async getVersionList(@Request() req, @Res() res: Response) {
    return await this.versionService
      .getVersionList({
        take: req.query.hasOwnProperty('take') ? req.query.take : 10,
        page: req.query.hasOwnProperty('page') ? req.query.page : 0,
      })
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
            message: '버전 목록 조회에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 대상 버전의 상세 정보를 조회합니다.
   *
   * @param version_idx 버전의 고유 번호
   * @param res         응답 객체
   */
  @Get('/read_version')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '버전 정보 조회 API',
    description: '대상 버전의 상세 정보를 조회합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          version_idx: 'cea1d926-6f1b-4a37-a46c-8ddf0b17a0bc',
          version_new: '2.3.0',
          version_current: '2.2.2',
          version_required: '2.2.2',
          version_detail: 'E-Check 신규 버전 출시, 버그 및 UIUX 개편',
          version_enabled: 1,
          version_create_date: '2022-05-25T23:30:51.371Z',
        },
      },
    },
  })
  getOneVersion(
    @Query('idx', ParseUUIDPipe) version_idx: string,
    @Res() res: Response,
  ) {
    return this.versionService
      .readByOneVersion(version_idx)
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
            message: '버전 정보 조회에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 버전의 정보를 변경합니다.
   *
   * @param version_idx 버전의 고유 번호
   * @param version     버전 정보 수정 값을 담은 객체
   * @param res         응답 객체
   */
  @Put('/update_version/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '버전 수정 API',
    description: '버전의 정보를 수정합니다.',
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
  async editVersion(
    @Param('idx', ParseUUIDPipe) version_idx: string,
    @Body() version: VersionUpdateDto,
    @Res() res: Response,
  ) {
    await this.versionService
      .editVersion(version_idx, version)
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
            message: '버전 정보 수정에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 버전의 사용 유무를 '사용'으로 변경합니다.
   *
   * @param version_idx 버전의 고유 번호
   * @param res         응답 객체
   */
  @Patch('/update_enabled/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '버전 사용 상태 변경 API',
    description: "버전의 사용 유무를 '사용'으로 변경합니다.",
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
  async editVersionEnabled(
    @Param('idx', ParseUUIDPipe) version_idx: string,
    @Res() res: Response,
  ) {
    await this.versionService
      .editVersionEnabled(version_idx)
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
            message: '버전 정보 수정에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 버전의 정보를 삭제합니다.
   *
   * @param version_idx 버전의 고유 번호
   * @param res         응답 객체
   */
  @Delete('/delete_version/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '버전 삭제 API',
    description: '버전의 정보를 삭제합니다.',
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
  async deleteVersion(
    @Param('idx', ParseUUIDPipe) version_idx: string,
    @Res() res: Response,
  ) {
    await this.versionService
      .deleteVersion(version_idx)
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
            message: '버전 정보 삭제에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }
}
