import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
import { FaqService } from './faq.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/user/user.entity';
import { FaqDto } from './dto/faq.dto';

@Controller('faq')
@ApiTags('Faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  /**
   * @author 박현진 팀장
   * @description 신규 FAQ을 생성합니다.
   *
   * @param res     응답 객체
   * @param faqDto  신규 생성 FAQ 정보를 담은 객체
   */
  @Post('/create_faq')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: 'FAQ생성 API',
    description:
      '신규 FAQ를 생성합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          faq_type: '오류문의',
          faq_post_type: '기간게시',
          faq_post_start_date: '2022-07-06',
          faq_post_end_date: '2022-07-11',
          faq_question: '테스트 질문인데용?',
          faq_answer: '테스트 답변인데요?',
          faq_idx: '839aea5b-8533-443a-bdf1-fdda54ec30bb',
          faq_create_date: '2022-07-06T03:05:37.972Z',
          faq_modify_date: '2022-07-06T03:05:37.972Z',
        },
      },
    },
  })
  async onCreateFaq(@Res() res: Response, @Body() faqDto: FaqDto) {
    await this.faqService
      .onCreateFaq(faqDto)
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
            message: '신규 FAQ 생성에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전체 FAQ의 목록을 조회합니다.
   *
   * @param request   요청 객체
   * @param res       응답 객체
   */
  @Get('/faq_list')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: 'FAQ 목록 조회 API',
    description: '전체 FAQ의 목록을 조회합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: [
          {
            faq_idx: '839aea5b-8533-443a-bdf1-fdda54ec30bb',
            faq_type: '오류문의',
            faq_post_type: '기간게시',
            faq_post_start_date: '2022-07-06',
            faq_post_end_date: '2022-07-11',
            faq_question: '테스트 질문인데용?',
            faq_answer: '테스트 답변인데요?',
          },
        ],
      },
    },
  })
  async getFaqList(@Request() req, @Res() res: Response) {
    return await this.faqService
      .getFaqList({
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
            message: 'FAQ 목록 조회에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 대상 FAQ의 상세 정보를 조회합니다.
   *
   * @param faq_idx     FAQ의 고유 번호
   * @param res         응답 객체
   */
  @Get('/read_faq')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: 'FAQ 정보 조회 API',
    description: '대상 FAQ의 상세 정보를 조회합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          faq_idx: '839aea5b-8533-443a-bdf1-fdda54ec30bb',
          faq_type: '오류문의',
          faq_post_type: '기간게시',
          faq_post_start_date: '2022-07-06',
          faq_post_end_date: '2022-07-11',
          faq_question: '테스트 질문인데용?',
          faq_answer: '테스트 답변인데요?',
          faq_create_date: '2022-05-25 15:11:22',
          faq_modify_date: '2022-05-25 15:11:22',
        },
      },
    },
  })
  getOneFaq(
    @Query('idx', ParseUUIDPipe) faq_idx: string,
    @Res() res: Response,
  ) {
    return this.faqService
      .readByOneFaq(faq_idx)
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
            message: 'FAQ 정보 조회에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description FAQ의 정보를 변경합니다.
   *
   * @param faq_idx FAQ의 고유 번호
   * @param faq     FAQ 정보 수정 값을 담은 객체
   * @param res     응답 객체
   */
  @Put('/update_faq/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: 'FAQ 수정 API',
    description:
      'FAQ의 정보를 수정합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
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
    @Body() faq: FaqDto,
    @Res() res: Response,
  ) {
    await this.faqService
      .editFaq(version_idx, faq)
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
            message: 'FAQ 정보 수정에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description FAQ의 정보를 삭제합니다.
   *
   * @param faq_idx FAQ의 고유 번호
   * @param res     응답 객체
   */
  @Delete('/delete_faq/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: 'FAQ 삭제 API',
    description:
      'FAQ의 정보를 삭제합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
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
  async deleteFaq(
    @Param('idx', ParseUUIDPipe) faq_idx: string,
    @Res() res: Response,
  ) {
    await this.faqService
      .deleteFaq(faq_idx)
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
            message: 'FAQ 정보 삭제에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }
}
