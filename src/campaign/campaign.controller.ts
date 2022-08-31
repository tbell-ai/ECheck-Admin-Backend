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
  Query,
  Request,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
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
import { CampaignService } from './campaign.service';
import { multerDiskOptions } from 'src/utils/multer.options';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CampaignDto } from './dto/campaign.dto';

@Controller('campaign')
@ApiTags('Campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  /**
   * @author 박현진 팀장
   * @description 신규 캠페인 정보를 생성합니다.
   *
   * @param res               응답 객체
   * @param files             신규 생성 캠페인 정보의 첨부 파일
   * @param campaign_title    신규 생성 캠페인 정보 제목
   * @param campaign_view_yn  신규 생성 캠페인 정보 노출 여부
   */
  @Post('/create_campaign')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '캠페인정보 생성 API',
    description:
      '신규 캠페인정보를 생성합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          campaign_idx: 'e851bc03-7c6a-4334-8cda-ae4c9ec523b1',
          campaign_title: 'test',
          campaign_view_yn: 1,
          campaign_create_date: '2022-07-20T04:39:42.539Z',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', null, multerDiskOptions))
  async onCreateCampaign(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('campaign_title') campaign_title: string,
    @Res() res: Response,
  ) {
    await this.campaignService
      .onCreateCampaign(files, campaign_title)
      .then(data => {
        res.status(HttpStatus.OK).json({
          code: '0000',
          message: '정상 처리되었습니다.',
          result: {
            campaign_idx: data.campaign_idx,
            campaign_title: data.campaign_title,
            campaign_view_yn: data.campaign_view_yn,
            campaign_create_date: data.campaign_create_date,
          },
        });
      })
      .catch(error => {
        throw new HttpException(
          {
            error: error,
            message: '캠페인 생성에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 전체 캠페인 정보의 목록을 조회합니다.
   *
   * @param request   요청 객체
   * @param res       응답 객체
   */
  @Get('/campaign_list')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '캠페인 정보 목록 조회 API',
    description:
      '전체 캠페인 정보의 목록을 조회합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: [
          {
            campaign_idx: 'e851bc03-7c6a-4334-8cda-ae4c9ec523b1',
            campaign_title: 'test',
            campaign_view_yn: 1,
            campaign_create_date: '2022-07-20T04:39:42.539Z',
          },
        ],
      },
    },
  })
  async getCampaignList(@Request() req, @Res() res: Response) {
    return await this.campaignService
      .getCampaignList({
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
            message: '캠페인 정보 목록 조회에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 대상 캠페인 정보의 상세 정보를 조회합니다.
   *
   * @param campaign_idx 캠페인 정보의 고유 번호
   * @param res          응답 객체
   */
  @Get('/read_campaign')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '캠페인 정보 조회 API',
    description: '대상 캠페인 정보의 상세 정보를 조회합니다.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        code: '0000',
        message: '정상 처리되었습니다.',
        result: {
          campaign: {
            campaign_idx: 'e851bc03-7c6a-4334-8cda-ae4c9ec523b1',
            campaign_title: 'test',
            campaign_view_yn: 1,
            campaign_create_date: '2022-07-20T04:39:42.539Z',
          },
          files: [
            {
              file_idx: '3f46864b-2930-4b2b-b2b1-4e7324b6e80e',
              orignal_filename: '01-01test.jpg',
              save_filename: '9da74490-6e36-4858-8406-f4d4db3ef954.jpg',
              file_path:
                'uploads/campaign/9da74490-6e36-4858-8406-f4d4db3ef954.jpg',
              file_extention: 'image/jpeg',
            },
          ],
        },
      },
    },
  })
  getOneCampaign(
    @Query('idx', ParseUUIDPipe) campaign_idx: string,
    @Res() res: Response,
  ) {
    return this.campaignService
      .readByOneCampaign(campaign_idx)
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
            message: '캠페인 정보 조회에 오류가 발생하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 캠페인 정보를 변경합니다.
   *
   * @param campaign_idx    캠페인 정보의 고유 번호
   * @param campaign        캠페인 정보 수정 값
   * @param new_files       캠페인 정보 추가할 파일
   */
  @Post('/update_campaign/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '캠페인 정보 수정 API',
    description: '캠페인 정보를 수정합니다.',
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
  @UseInterceptors(FilesInterceptor('new_files', null, multerDiskOptions))
  async editCampaign(
    @UploadedFiles() new_files: Array<Express.Multer.File>,
    @Param('idx', ParseUUIDPipe) campaign_idx: string,
    @Body('campaign') campaign: string,
    @Res() res: Response,
  ) {
    const campaignDto: CampaignDto = JSON.parse(campaign);

    await this.campaignService
      .editCampaign(campaign_idx, campaignDto, new_files)
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
            message: '캠페인 정보 수정에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }

  /**
   * @author 박현진 팀장
   * @description 캠페인 정보를 삭제합니다.
   *
   * @param campaign_idx 캠페인 정보의 고유 번호
   * @param res          응답 객체
   */
  @Delete('/delete_campaign/:idx')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('LOGIN_TOKEN')
  @ApiOperation({
    summary: '캠페인 정보 삭제 API',
    description:
      '캠페인 정보를 삭제합니다. 관리자(ADMIN) 권한을 가진 사용자만 호출 가능합니다.',
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
  async deleteCampaign(
    @Param('idx', ParseUUIDPipe) campaign_idx: string,
    @Res() res: Response,
  ) {
    await this.campaignService
      .deleteCampaign(campaign_idx)
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
            message: '캠페인 정보 삭제에 실패하였습니다.',
          },
          HttpStatus.FORBIDDEN,
        );
      });
  }
}
