import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Campaign } from './campaign.entity';

@EntityRepository(Campaign)
export class CampaignRepository extends Repository<Campaign> {
  /**
   * @author 박현진 팀장
   * @description 신규 캠페인 정보를 DB에 Insert하는 메서드
   *
   * @param campaignDto  신규 캠페인 정보 데이터를 담은 객체
   *
   * @returns {Promise<Campaign>}
   */
  async onCreateCampaign(campaign_title: string): Promise<Campaign> {
    try {
      return await this.save({
        campaign_title,
        campaign_view_yn: 0,
      });
    } catch (error) {
      throw new HttpException(
        {
          error: error,
          message: '오류가 발생하였습니다. 잠시후 다시 시도해주세요.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)를 가진 캠페인 정보를 조회
   *
   * @param campaign_idx  조회 대상 캠페인 정보의 고유번호
   *
   * @returns {Promise<Campaign>}
   */
  async findByCampaignIdx(campaign_idx: string): Promise<Campaign> {
    const campaign = await this.findOne({
      where: { campaign_idx: campaign_idx },
    });

    if (!campaign) {
      throw new NotFoundException('해당 캠페인 정보를 찾을 수 없습니다.');
    } else {
      return campaign;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)를 가진 캠페인 정보를 수정
   *
   * @param campaign_idx      수정 대상 캠페인 정보의 고유번호
   * @param campaign_title    수정 캠페인 제목
   * @param campaign_view_yn  수정 캠페인 노출여부
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditCampaign(
    campaign_idx: string,
    campaign_title: string,
    campaign_view_yn: number,
  ): Promise<boolean> {
    const editResult = await this.update(
      { campaign_idx },
      {
        campaign_title: campaign_title,
        campaign_view_yn: campaign_view_yn,
      },
    );

    if (editResult.affected !== 1) {
      throw new NotFoundException('해당 캠페인 정보가 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)를 가진 캠페인 정보를 삭제
   *
   * @param campaign_idx  삭제 대상 캠페인 정보의 고유번호
   *
   * @returns {Promise<boolean>}
   */
  async onDeleteCampaign(campaign_idx: string): Promise<boolean> {
    const deleteCampaign = await this.delete(campaign_idx);

    if (deleteCampaign.affected === 0) {
      throw new NotFoundException('해당하는 캠페인 정보가 존재하지 않습니다.');
    } else {
      return true;
    }
  }
}
