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
import { ContractService } from './contract.service';
import { ContractDto } from './dto/contract.dto';

@Controller('contract')
@ApiTags('Contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  /**
   * @author 박현진 팀장
   * @description 신규 계약 정보를 생성합니다.
   *
   * @param res           응답 객체
   * @param contractDto   신규 생성 계약 정보를 담은 객체
   */
  @Post('/create_contract')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '계약정보 생성 API',
    description: '신규 계약정보를 생성합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          contract_before_elect: 123,
          contract_last_date: '2022-07-01',
          contract_use: '주택용(저압)',
          contract_house: '주거용',
          contract_idx: '61c319f3-a7a4-4b82-a867-fae2487506fe',
          contract_create_date: '2022-07-07T02:08:00.687Z',
          contract_modify_date: '2022-07-07T02:08:00.687Z',
        },
      },
    },
  })
  async onCreateContract(
    @Res() res: Response,
    @Body() contractDto: ContractDto,
  ) {
    await this.contractService
      .onCreateContract(contractDto)
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
            message: '신규 계약정보 생성에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전체 계약정보의 목록을 조회합니다.
   *
   * @param request   요청 객체
   * @param res       응답 객체
   */
  @Get('/contract_list')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '계약정보 목록 조회 API',
    description:
      '전체 계약정보의 목록을 조회합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: [
          {
            contract_idx: '61c319f3-a7a4-4b82-a867-fae2487506fe',
            contract_before_elect: 123,
            contract_last_date: '2022-07-01',
            contract_use: '주택용(저압)',
            contract_house: '주거용',
            contract_create_date: '2022-07-07T02:08:00.687Z',
            contract_modify_date: '2022-07-07T02:08:00.687Z',
          },
        ],
      },
    },
  })
  async getContractList(@Request() req, @Res() res: Response) {
    return await this.contractService
      .getContractList({
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
            message: '계약정보 목록 조회에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 대상 계약정보의 상세 정보를 조회합니다.
   *
   * @param contract_idx 계약정보의 고유 번호
   * @param res          응답 객체
   */
  @Get('/read_contract')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '계약정보 조회 API',
    description: '대상 계약정보의 상세 정보를 조회합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          contract_idx: '61c319f3-a7a4-4b82-a867-fae2487506fe',
          contract_before_elect: 123,
          contract_last_date: '2022-07-01',
          contract_use: '주택용(저압)',
          contract_house: '주거용',
          contract_create_date: '2022-07-07T02:08:00.687Z',
          contract_modify_date: '2022-07-07T02:08:00.687Z',
        },
      },
    },
  })
  getOneContract(
    @Query('idx', ParseUUIDPipe) contract_idx: string,
    @Res() res: Response,
  ) {
    return this.contractService
      .readByOneContract(contract_idx)
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
            message: '계약 정보 조회에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 계약 정보를 변경합니다.
   *
   * @param contract_idx 계약정보의 고유 번호
   * @param contract     계약 정보 수정 값을 담은 객체
   * @param res         응답 객체
   */
  @Put('/update_contract/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '계약정보 수정 API',
    description: '계약 정보를 수정합니다.',
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
  async editContract(
    @Param('idx', ParseUUIDPipe) contract_idx: string,
    @Body() contract: ContractDto,
    @Res() res: Response,
  ) {
    await this.contractService
      .editContract(contract_idx, contract)
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
            message: '계약 정보 수정에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 계약 정보를 삭제합니다.
   *
   * @param contract_idx 계약정보의 고유 번호
   * @param res         응답 객체
   */
  @Delete('/delete_contract/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '계약정보 삭제 API',
    description:
      '계약 정보를 삭제합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
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
  async deleteContract(
    @Param('idx', ParseUUIDPipe) contract_idx: string,
    @Res() res: Response,
  ) {
    await this.contractService
      .deleteContract(contract_idx)
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
            message: '계약 정보 삭제에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }
}
