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
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/user/user.entity';
import { DiscountService } from './discount.service';
import { DiscountDto } from './dto/discount.dto';

@Controller('discount')
@ApiTags('Discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  /**
   * @author 박현진 팀장
   * @description 신규 할인 정보를 생성합니다.
   *
   * @param res           응답 객체
   * @param contractDto   신규 생성 할인 정보를 담은 객체
   */
  @Post('/create_discount')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '할인정보 생성 API',
    description: '신규 할인정보를 생성합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          discount_bigfamily_yn: 1,
          discount_bigfamily: '3자녀이상 가구',
          discount_lifedevice_yn: 0,
          discount_welfare_yn: 0,
          discount_welfare: null,
          discount_idx: 'c5211e6a-9d08-4c69-b953-08b93075968c',
          discount_create_date: '2022-07-08T04:53:47.270Z',
          discount_modify_date: '2022-07-08T04:53:47.270Z',
        },
      },
    },
  })
  async onCreateDiscount(
    @Res() res: Response,
    @Body() discountDto: DiscountDto,
  ) {
    await this.discountService
      .onCreateDiscount(discountDto)
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
            message: '신규 할인정보 생성에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전체 할인정보의 목록을 조회합니다.
   *
   * @param request   요청 객체
   * @param res       응답 객체
   */
  @Get('/discount_list')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '할인정보 목록 조회 API',
    description:
      '전체 할인정보의 목록을 조회합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: [
          {
            discount_bigfamily_yn: 1,
            discount_bigfamily: '3자녀이상 가구',
            discount_lifedevice_yn: 0,
            discount_welfare_yn: 0,
            discount_welfare: null,
            discount_idx: 'c5211e6a-9d08-4c69-b953-08b93075968c',
            discount_create_date: '2022-07-08T04:53:47.270Z',
            discount_modify_date: '2022-07-08T04:53:47.270Z',
          },
        ],
      },
    },
  })
  async getDiscountList(@Request() req, @Res() res: Response) {
    return await this.discountService
      .getDiscountList({
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
            message: '할인정보 목록 조회에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 대상 할인정보의 상세 정보를 조회합니다.
   *
   * @param discount_idx 할인정보의 고유 번호
   * @param res          응답 객체
   */
  @Get('/read_discount')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '할인정보 조회 API',
    description: '대상 할인정보의 상세 정보를 조회합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          discount_bigfamily_yn: 1,
          discount_bigfamily: '3자녀이상 가구',
          discount_lifedevice_yn: 0,
          discount_welfare_yn: 0,
          discount_welfare: null,
          discount_idx: 'c5211e6a-9d08-4c69-b953-08b93075968c',
          discount_create_date: '2022-07-08T04:53:47.270Z',
          discount_modify_date: '2022-07-08T04:53:47.270Z',
        },
      },
    },
  })
  getOneDiscount(
    @Query('idx', ParseUUIDPipe) discount_idx: string,
    @Res() res: Response,
  ) {
    return this.discountService
      .readByOneDiscount(discount_idx)
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
            message: '할인 정보 조회에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 할인 정보를 변경합니다.
   *
   * @param discount_idx 할인정보의 고유 번호
   * @param discount     할인 정보 수정 값을 담은 객체
   * @param res          응답 객체
   */
  @Put('/update_discount/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '할인정보 수정 API',
    description: '할인 정보를 수정합니다.',
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
  async editDiscount(
    @Param('idx', ParseUUIDPipe) discount_idx: string,
    @Body() discount: DiscountDto,
    @Res() res: Response,
  ) {
    await this.discountService
      .editDiscount(discount_idx, discount)
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
            message: '할인 정보 수정에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 할인 정보를 삭제합니다.
   *
   * @param discount_idx 할인정보의 고유 번호
   * @param res          응답 객체
   */
  @Delete('/delete_discount/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '할인정보 삭제 API',
    description:
      '할인 정보를 삭제합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
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
  async deleteDiscount(
    @Param('idx', ParseUUIDPipe) discount_idx: string,
    @Res() res: Response,
  ) {
    await this.discountService
      .deleteDiscount(discount_idx)
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
            message: '할인 정보 삭제에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }
}
