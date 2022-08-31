import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { DefaultCharge } from '../entity/charge.default.entity';
import { DefaultChargeDto } from '../dto/charge.default.dto';

@EntityRepository(DefaultCharge)
export class DefaultChargeRepository extends Repository<DefaultCharge> {
  /**
   * @author 박현진 팀장
   * @description DB에 새로운 기본요금 정보를 입력함
   *
   * @param charge  신규 생성할 기본요금 정보를 담은 객체
   *
   * @returns {Promise<DefaultCharge>} 신규 생성된 기본요금 정보
   */
  async onCreateDefaultCharge(
    charge: DefaultChargeDto,
  ): Promise<DefaultCharge> {
    try {
      const {
        default_etc1,
        default_etc2,
        default_etc3,
        default_summer1,
        default_summer2,
        default_summer3,
        default_charge_start_date,
        use_type,
      } = charge;

      return await this.save({
        default_etc1,
        default_etc2,
        default_etc3,
        default_summer1,
        default_summer2,
        default_summer3,
        default_charge_start_date,
        use_type,
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
   * @description 기본요금 DB에서 해당하는 사용용도(USE_TYPE)를 가진 기본요금 정보를 조회
   *
   * @param use_type  조회 대상 기본 요금 정보의 사용용도
   *
   * @returns {Promise<DefaultCharge>} 사용용도에 해당하는 기본요금 정보
   */
  async findByDefaultCharge(use_type: string): Promise<DefaultCharge> {
    const defaultCharge = await this.findOne({ where: { use_type: use_type } });

    if (!defaultCharge) {
      throw new NotFoundException('기본요금 정보를 찾을 수 없습니다.');
    } else {
      return defaultCharge;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 기본요금 DB에서 해당하는 사용용도(USE_TYPE)를 가진 기본요금 정보를 수정
   *
   * @param use_type  수정 대상 기본 요금 정보의 사용용도
   * @param charge  수정할 기본요금 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditDefaultCharge(
    default_charge_idx: string,
    charge: DefaultChargeDto,
  ): Promise<boolean> {
    const {
      default_etc1,
      default_etc2,
      default_etc3,
      default_summer1,
      default_summer2,
      default_summer3,
      use_type,
      default_charge_start_date,
    } = charge;

    const editResult = await this.update(
      { default_charge_idx },
      {
        default_etc1,
        default_etc2,
        default_etc3,
        default_summer1,
        default_summer2,
        default_summer3,
        use_type,
        default_charge_start_date,
      },
    );

    if (editResult.affected !== 1) {
      throw new NotFoundException('해당 요금정보는 존재하지 않습니다.');
    } else {
      return true;
    }
  }
}
