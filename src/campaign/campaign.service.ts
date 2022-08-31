import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageFileRepository } from 'src/imagefile/imagefile.repository';
import { Pagination, PaginationOptions } from 'src/paginate';
import { Campaign } from './campaign.entity';
import { CampaignRepository } from './campaign.repository';
import * as fs from 'fs';
import { CampaignDto } from './dto/campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(CampaignRepository)
    private campaignRepository: CampaignRepository,
    @InjectRepository(ImageFileRepository)
    private imageFileRepository: ImageFileRepository,
  ) {}

  /**
   * @author 박현진 팀장
   * @description 신규 캠페인 정보를 생성하는 비즈니스 로직
   *
   * @param files             신규 캠페인 생성시 업로드된 파일 목록
   * @param campaign_title    신규 캠페인 제목
   * @param campaign_view_yn  신규 캠페인 노출여부
   *
   * @returns {Promise<Campaign>} 생성된 Campaign 정보를 반환합니다.
   */
  async onCreateCampaign(
    files: Array<Express.Multer.File>,
    campaign_title: string,
  ): Promise<Campaign> {
    const campaign = await this.campaignRepository.onCreateCampaign(
      campaign_title,
    );

    if (files.length > 0) {
      const imageFile =
        await this.imageFileRepository.onCreateCampaignImageFile(
          files,
          campaign,
        );

      if (imageFile.length > 0) {
        return campaign;
      } else {
        throw new BadRequestException(
          '업로드한 파일에 문제가 발생해 캠페인 생성을 취소합니다. 파일을 확인해주세요.',
        );
      }
    } else {
      return campaign;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 캠페인 정보 목록을 조회하는 API
   *
   * @param options  페이징을 위한 옵션값을 담은 객체
   *
   * @returns {Campaign[]}
   */
  async getCampaignList(
    options: PaginationOptions,
  ): Promise<Pagination<Campaign>> {
    const { take, page } = options;
    const [results, total] = await this.campaignRepository.findAndCount({
      select: [
        'campaign_idx',
        'campaign_title',
        'campaign_view_yn',
        'campaign_create_date',
      ],
      take: take,
      skip: take * (page - 1),
      order: { campaign_create_date: 'DESC' },
    });

    return new Pagination<Campaign>({
      results,
      total,
    });
  }

  /**
   * @author 박현진 팀장
   * @description 캠페인 정보 고유번호(IDX)를 통해 단일 캠페인 정보를 조회하는 API
   *
   * @param campaign_idx  캠페인 정보 고유번호
   *
   * @returns {Campaign}  조회된 캠페인 정보의 상세 정보를 리턴함
   */
  async readByOneCampaign(campaign_idx: string): Promise<any> {
    return {
      campaign: await this.campaignRepository.findByCampaignIdx(campaign_idx),
      files: await this.imageFileRepository.findByCampaignIdx(campaign_idx),
    };
  }

  /**
   * @author 박현진 팀장
   * @description 캠페인 정보 고유번호(IDX)를 통해 단일 캠페인 정보를 수정하는 API
   *
   * @param campaign_idx     캠페인 정보의 고유 번호
   * @param campaign_title   캠페인 정보 수정 값
   * @param delete_files     캠페인 정보 삭제할 파일
   * @param new_files        캠페인 정보 추가할 파일
   *
   * @returns {Promise<boolean>}  true / false
   */
  async editCampaign(
    campaign_idx: string,
    campaignDto: CampaignDto,
    new_files: Array<Express.Multer.File>,
  ): Promise<boolean> {
    const update = await this.campaignRepository.onEditCampaign(
      campaign_idx,
      campaignDto.campaign_title,
      campaignDto.campaign_view_yn,
    );

    if (update) {
      const campaign = await this.campaignRepository.findByCampaignIdx(
        campaign_idx,
      );

      // 1. 삭제할 파일 목록이 있는지? (파일 목록은 파일의 idx이다.)
      if (campaignDto.delete_files.length > 0) {
        // 파일 삭제
        for (const value of campaignDto.delete_files) {
          const deleteFilePath =
            await this.imageFileRepository.onDeleteImageFile(value);

          if (fs.existsSync(deleteFilePath)) {
            await fs.unlink(deleteFilePath, err => {
              if (err) {
                throw new ForbiddenException({
                  message: '파일 삭제에 실패하였습니다. 다시 시도해주세요.',
                });
              }
            });
          } else {
            throw new NotFoundException({
              message: '존재하지 않는 파일입니다.',
            });
          }
        }
      }

      // 2. 신규 파일 업로드가 있는가?
      if (new_files.length > 0) {
        const imageFile =
          await this.imageFileRepository.onCreateCampaignImageFile(
            new_files,
            campaign,
          );

        if (imageFile.length > 0) {
          return update;
        } else {
          throw new BadRequestException(
            '업로드한 파일에 문제가 발생해 캠페인 수정을 취소합니다. 파일을 확인해주세요.',
          );
        }
      }

      return update;
    } else {
      throw new NotFoundException(
        '캠페인 정보를 찾을 수 없어 수정하지 못했습니다.',
      );
    }
  }

  /**
   * @author 박현진 팀장
   * @description 캠페인 정보 고유번호(IDX)를 통해 단일 캠페인 정보를 삭제하는 API
   *
   * @param campaign_idx  캠페인 정보 고유번호
   *
   * @returns {Promise<boolean>}  true / false
   */
  async deleteCampaign(campaign_idx: string): Promise<boolean> {
    return await this.campaignRepository.onDeleteCampaign(campaign_idx);
  }
}
