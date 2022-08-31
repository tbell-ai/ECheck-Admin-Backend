import {
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
  Query,
  HttpStatus,
  HttpException,
  Get,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Body,
  Put,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ChargeService } from './charge.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DefaultChargeDto } from './dto/charge.default.dto';
import { ElectChargeDto } from './dto/charge.elect.dto';
import {
  CommonChargeDto,
  DiscountChargeDto,
  EnvironmentChargeDto,
  RequirementChargeDto,
  TaxChargeDto,
} from './dto/charge.common.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/user/user.entity';

@Controller('charge')
@ApiTags('Charge')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 기본요금 정보를 신규 생성합니다.
   *
   * @param req     응답 객체
   * @param charge  신규 생성을 위한 기본요금 정보를 담은 객체
   */
  @Post('/create_default')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '기본요금 생성하기 API',
    description:
      '기본요금 정보를 생성합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          default_charge_idx: '94c8fdb8-5cfe-4f69-a5b....',
          default_etc1: 900,
          default_etc2: 1600,
          default_etc3: 7300,
          default_summer1: 900,
          default_summer2: 1600,
          default_summer3: 7300,
          use_type: '주택용(저압)',
          default_charge_start_date: '2022-06-27',
          default_charge_create_date: '2022-05-25T23:30:51.371Z',
          default_charge_last_modify_date: '2022-05-25T23:30:51.371Z',
        },
      },
    },
  })
  async createDefaultCharge(
    @Res() res: Response,
    @Body() charge: DefaultChargeDto,
  ) {
    await this.chargeService
      .onCreateDefaultCharge(charge)
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
            message: '기본요금 정보 생성에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 기본요금 정보를 수정합니다.
   *
   * @param res                응답 객체
   * @param elect_charge_idx   수정 대상 기본 요금의 고유 번호
   * @param charge             수정 대상 기본 요금 정보를 담은 객체
   */
  @Put('/update_default/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '기본요금 수정하기 API',
    description:
      '기본요금 정보를 수정합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
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
  async updateDefaultCharge(
    @Param('idx', ParseUUIDPipe) default_charge_idx: string,
    @Body() charge: DefaultChargeDto,
    @Res() res: Response,
  ) {
    await this.chargeService
      .onEditDefaultCharge(default_charge_idx, charge)
      .then(data => {
        res.status(HttpStatus.OK).json({
          code: '0000',
          message: '정상 처리되었습니다.',
          return: data,
        });
      })
      .catch(error => {
        throw new HttpException(
          {
            error: error,
            message: '기본 요금 수정에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 기본요금 정보를 조회합니다.
   *
   * @param res        응답 객체
   * @param use_type   수정 대상 기본 요금의 사용 용도
   */
  @Get('/get_default')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '기본요금 불러오기 API',
    description: '기본요금 정보를 불러옵니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          default_charge_idx: '94c8fdb8-5cfe-4f69-a5b....',
          default_etc1: 900,
          default_etc2: 1600,
          default_etc3: 7300,
          default_summer1: 900,
          default_summer2: 1600,
          default_summer3: 7300,
          use_type: '주택용(저압)',
          default_charge_start_date: '2022-06-27',
          default_charge_create_date: '2022-05-25T23:30:51.371Z',
          default_charge_last_modify_date: '2022-05-25T23:30:51.371Z',
        },
      },
    },
  })
  async getDefaultCharge(
    @Res() res: Response,
    @Query('use_type') use_type: string,
  ) {
    await this.chargeService
      .getDefaultCharge(use_type)
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
            message: '기본요금 정보를 찾을 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 전력량요금 정보를 신규 생성합니다.
   *
   * @param res     응답 객체
   * @param charge  신규 생성을 위한 전력량요금 정보를 담은 객체
   */
  @Post('/create_elect')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '전력량요금 생성하기 API',
    description:
      '전력량요금 정보를 생성합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          elect_charge_idx: '94c8fdb8-5cfe-4f69-a5b....',
          elect_etc1: 98.1,
          elect_etc2: 192.7,
          elect_etc3: 285.4,
          elect_summer1: 98.1,
          elect_summer2: 192.7,
          elect_summer3: 285.4,
          elect_super: 714.3,
          use_type: '주택용(저압)',
          elect_charge_start_date: '2022-06-27',
          elect_charge_create_date: '2022-05-25T23:30:51.371Z',
          elect_charge_last_modify_date: '2022-05-25T23:30:51.371Z',
        },
      },
    },
  })
  async createElectCharge(
    @Res() res: Response,
    @Body() charge: ElectChargeDto,
  ) {
    await this.chargeService
      .onCreateElectCharge(charge)
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
            message: '전력량요금 정보 생성에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 전력량요금 정보를 수정합니다.
   *
   * @param res                응답 객체
   * @param elect_charge_idx   수정 대상 전력량 요금의 고유 번호
   * @param charge             수정 대상 전력량 요금 정보를 담은 객체
   */
  @Put('/update_elect/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '전력량요금 수정하기 API',
    description:
      '전력량요금 정보를 수정합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
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
  async updateElectCharge(
    @Param('idx', ParseUUIDPipe) elect_charge_idx: string,
    @Body() charge: ElectChargeDto,
    @Res() res: Response,
  ) {
    await this.chargeService
      .onEditElectCharge(elect_charge_idx, charge)
      .then(data => {
        res.status(HttpStatus.OK).json({
          code: '0000',
          message: '정상 처리되었습니다.',
          return: data,
        });
      })
      .catch(error => {
        throw new HttpException(
          {
            error: error,
            message: '전력량 요금 수정에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 전력량요금 정보를 조회합니다.
   *
   * @param res       응답 객체
   * @param use_type  조회 대상 전력량 요금의 사용 용도
   */
  @Get('/get_elect')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '전력량요금 불러오기 API',
    description: '전력량요금 정보를 불러옵니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        elect_charge_idx: '94c8fdb8-5cfe-4f69-a5b....',
        elect_etc1: 900,
        elect_etc2: 1600,
        elect_etc3: 7300,
        elect_summer1: 900,
        elect_summer2: 1600,
        elect_summer3: 7300,
        use_type: '주택용(저압)',
        elect_charge_start_date: '2022-06-27',
        elect_charge_create_date: '2022-05-25T23:30:51.371Z',
        elect_charge_last_modify_date: '2022-05-25T23:30:51.371Z',
      },
    },
  })
  async getElectCharge(
    @Res() res: Response,
    @Query('use_type') use_type: string,
  ) {
    await this.chargeService
      .getElectCharge(use_type)
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
            message: '전력량요금 정보를 찾을 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 공통요금 정보를 신규 생성합니다.
   *
   * @param res     응답 객체
   * @param charge  신규 생성을 위한 공통요금 정보를 담은 객체
   */
  @Post('/create_common')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '공통요금 생성하기 API',
    description:
      '공통요금 정보를 생성합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          common_charge_idx: 'e783dff6-f7d8-4664-bf94-db20c3693a83',
          environment_charge: 7.3,
          fuel_ratio_charge: 3,
          require_charge_low: 2000,
          require_charge_high: 1500,
          welfare1_etc_limit: 16000,
          welfare1_summer_limit: 20000,
          welfare2_etc_limit: 16000,
          welfare2_summer_limit: 20000,
          welfare3_etc_limit: 10000,
          welfare3_summer_limit: 12000,
          welfare4_etc_limit: 8000,
          welfare4_summer_limit: 10000,
          bigfamily_percent: 0.3,
          bigfamily_limit: 16000,
          lifedevice_percent: 0.3,
          elect_tax: 0.1,
          elect_fund: 0.037,
          common_charge_create_date: '2022-06-27T07:57:45.727Z',
          common_charge_last_modify_date: '2022-06-27T07:57:45.727Z',
        },
      },
    },
  })
  async createCommonCharge(
    @Res() res: Response,
    @Body() charge: CommonChargeDto,
  ) {
    await this.chargeService
      .onCreateCommonCharge(charge)
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
            message: '공통요금 정보 생성에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 공통요금 정보를 조회합니다.
   *
   * @param res               응답 객체
   * @param common_charge_idx 조회 대상 공통 요금의 고유 번호
   */
  @Get('/get_common/:idx')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '공통요금 불러오기 API',
    description: '공통요금 정보를 불러옵니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          common_charge_idx: 'e783dff6-f7d8-4664-bf94-db20c3693a83',
          environment_charge: 7.3,
          fuel_ratio_charge: 5.0,
          require_charge_low: 2000,
          require_charge_high: 1500,
          welfare1_etc_limit: 16000,
          welfare1_summer_limit: 20000,
          welfare2_etc_limit: 16000,
          welfare2_summer_limit: 20000,
          welfare3_etc_limit: 10000,
          welfare3_summer_limit: 12000,
          welfare4_etc_limit: 8000,
          welfare4_summer_limit: 10000,
          bigfamily_percent: 0.3,
          bigfamily_limit: 16000,
          lifedevice_percent: 0.3,
          elect_tax: 0.1,
          elect_fund: 0.037,
          common_charge_create_date: '2022-06-27T07:57:45.727Z',
          common_charge_last_modify_date: '2022-06-27T07:57:45.727Z',
        },
      },
    },
  })
  async getCommonCharge(
    @Res() res: Response,
    @Param('idx', ParseUUIDPipe) common_charge_idx: string,
  ) {
    await this.chargeService
      .getCommonCharge(common_charge_idx)
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
            message: '공통요금 정보를 찾을 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 공통요금 정보 중에 환경요금을 조회합니다.
   *
   * @param res               응답 객체
   * @param common_charge_idx 조회 대상 공통 요금의 고유 번호
   */
  @Get('/get_environment/:idx')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '환경요금 불러오기 API',
    description: '공통요금 정보에서 환경요금을 불러옵니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          common_charge_idx: 'e783dff6-f7d8-4664-bf94-db20c3693a83',
          environment_charge: 7.3,
          fuel_ratio_charge: 5.0,
        },
      },
    },
  })
  async getEnvironmentCharge(
    @Res() res: Response,
    @Param('idx', ParseUUIDPipe) common_charge_idx: string,
  ) {
    await this.chargeService
      .getEnvironmentCharge(common_charge_idx)
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
            message: '공통요금 정보를 찾을 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 공통요금 정보 중에 환경요금을 수정합니다.
   *
   * @param res               응답 객체
   * @param common_charge_idx 수정 대상 공통 요금의 고유 번호
   * @param charge            환경요금 수정 정보를 담은 객체
   */
  @Patch('/update_environment/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '환경요금 수정하기 API',
    description:
      '공통요금 정보에서 환경요금을 수정합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
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
  async updateEnvironmentCharge(
    @Res() res: Response,
    @Param('idx', ParseUUIDPipe) common_charge_idx: string,
    @Body() charge: EnvironmentChargeDto,
  ) {
    await this.chargeService
      .onEditEnvironmentCharge(common_charge_idx, charge)
      .then(data => {
        res.status(HttpStatus.OK).json({
          code: '0000',
          message: '정상 처리되었습니다.',
          return: data,
        });
      })
      .catch(error => {
        throw new HttpException(
          {
            error: error,
            message: '환경 요금 수정에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 공통요금 정보 중에 필수사용량 보장공제 요금을 조회합니다.
   *
   * @param res               응답 객체
   * @param common_charge_idx 조회 대상 공통 요금의 고유 번호
   */
  @Get('/get_requirement/:idx')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '필수사용량 보장공제 요금 불러오기 API',
    description: '공통요금 정보에서 필수사용량 보장공제 요금을 불러옵니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          common_charge_idx: 'e783dff6-f7d8-4664-bf94-db20c3693a83',
          require_charge_low: 2000,
          require_charge_high: 1500,
        },
      },
    },
  })
  async getRequirementCharge(
    @Res() res: Response,
    @Param('idx', ParseUUIDPipe) common_charge_idx: string,
  ) {
    await this.chargeService
      .getRequirementCharge(common_charge_idx)
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
            message: '공통요금 정보를 찾을 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 공통요금 정보 중에 필수사용량 보장공제 요금을 수정합니다.
   *
   * @param res               응답 객체
   * @param common_charge_idx 수정 대상 공통 요금의 고유 번호
   * @param charge            필수사용량 보장공제 요금 수정 정보를 담은 객체
   */
  @Patch('/update_requirement/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '필수사용량 보장공제 요금 수정하기 API',
    description:
      '공통요금 정보에서 필수사용량 보장공제 요금을 수정합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
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
  async updateRequireCharge(
    @Res() res: Response,
    @Param('idx', ParseUUIDPipe) common_charge_idx: string,
    @Body() charge: RequirementChargeDto,
  ) {
    await this.chargeService
      .onEditRequirementCharge(common_charge_idx, charge)
      .then(data => {
        res.status(HttpStatus.OK).json({
          code: '0000',
          message: '정상 처리되었습니다.',
          return: data,
        });
      })
      .catch(error => {
        throw new HttpException(
          {
            error: error,
            message: '필수사용량 보장공제 요금 수정에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 공통요금 정보 중에 할인요금을 조회합니다.
   *
   * @param res               응답 객체
   * @param common_charge_idx 조회 대상 공통 요금의 고유 번호
   */
  @Get('/get_discount/:idx')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '할인요금 불러오기 API',
    description: '공통요금 정보에서 할인요금을 불러옵니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          common_charge_idx: 'e783dff6-f7d8-4664-bf94-db20c3693a83',
          welfare1_etc_limit: 16000,
          welfare1_summer_limit: 20000,
          welfare2_etc_limit: 16000,
          welfare2_summer_limit: 20000,
          welfare3_etc_limit: 10000,
          welfare3_summer_limit: 12000,
          welfare4_etc_limit: 8000,
          welfare4_summer_limit: 10000,
          bigfamily_percent: 0.3,
          bigfamily_limit: 16000,
          lifedevice_percent: 0.3,
        },
      },
    },
  })
  async getDiscountCharge(
    @Res() res: Response,
    @Param('idx', ParseUUIDPipe) common_charge_idx: string,
  ) {
    await this.chargeService
      .getDiscountCharge(common_charge_idx)
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
            message: '공통요금 정보를 찾을 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 공통요금 정보 중에 할인요금을 수정합니다.
   *
   * @param res               응답 객체
   * @param common_charge_idx 수정 대상 공통 요금의 고유 번호
   * @param charge            할인 요금 수정 정보를 담은 객체
   */
  @Patch('/update_discount/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '할인 요금 수정하기 API',
    description:
      '공통요금 정보에서 할인 요금을 수정합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
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
  async updateDiscountCharge(
    @Res() res: Response,
    @Param('idx', ParseUUIDPipe) common_charge_idx: string,
    @Body() charge: DiscountChargeDto,
  ) {
    await this.chargeService
      .onEditDiscountCharge(common_charge_idx, charge)
      .then(data => {
        res.status(HttpStatus.OK).json({
          code: '0000',
          message: '정상 처리되었습니다.',
          return: data,
        });
      })
      .catch(error => {
        throw new HttpException(
          {
            error: error,
            message: '할인 요금 수정에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 공통요금 정보 중에 세금관련 요금을 조회합니다.
   *
   * @param res               응답 객체
   * @param common_charge_idx 조회 대상 공통 요금의 고유 번호
   */
  @Get('/get_tax/:idx')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '세금관련 요금 불러오기 API',
    description: '공통요금 정보에서 세금관련 요금을 불러옵니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          common_charge_idx: 'e783dff6-f7d8-4664-bf94-db20c3693a83',
          elect_tax: 0.1,
          elect_fund: 0.037,
        },
      },
    },
  })
  async getTaxCharge(
    @Res() res: Response,
    @Param('idx', ParseUUIDPipe) common_charge_idx: string,
  ) {
    await this.chargeService
      .getTaxCharge(common_charge_idx)
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
            message: '공통요금 정보를 찾을 수 없습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전기 요금 계산을 위한 공통요금 정보 중에 세금관련 요금을 수정합니다.
   *
   * @param res               응답 객체
   * @param common_charge_idx 수정 대상 공통 요금의 고유 번호
   * @param charge            세금관련 요금 수정 정보를 담은 객체
   */
  @Patch('/update_tax/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '세금관련 요금 수정하기 API',
    description:
      '공통요금 정보에서 세금관련 요금을 수정합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
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
  async updateTaxCharge(
    @Res() res: Response,
    @Param('idx', ParseUUIDPipe) common_charge_idx: string,
    @Body() charge: TaxChargeDto,
  ) {
    await this.chargeService
      .onEditTaxCharge(common_charge_idx, charge)
      .then(data => {
        res.status(HttpStatus.OK).json({
          code: '0000',
          message: '정상 처리되었습니다.',
          return: data,
        });
      })
      .catch(error => {
        throw new HttpException(
          {
            error: error,
            message: '세금관련 요금 수정에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }
}
