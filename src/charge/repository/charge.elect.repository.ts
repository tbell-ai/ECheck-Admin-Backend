import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ElectCharge } from '../entity/charge.elect.entity';
import { ElectChargeDto } from '../dto/charge.elect.dto';

@EntityRepository(ElectCharge)
export class ElectChargeRepository extends Repository<ElectCharge> {
  /**
   * @author 박현진 팀장
   * @description DB에 새로운 전력량요금 정보를 입력함
   *
   * @param charge  신규 생성할 전력량요금 정보를 담은 객체
   *
   * @returns {Promise<ElectCharge>} 신규 생성된 전력량요금 정보
   */
  async onCreateElectCharge(charge: ElectChargeDto): Promise<ElectCharge> {
    try {
      const {
        elect_etc1,
        elect_etc2,
        elect_etc3,
        elect_summer1,
        elect_summer2,
        elect_summer3,
        elect_super,
        elect_charge_start_date,
        use_type,
      } = charge;

      return await this.save({
        elect_etc1,
        elect_etc2,
        elect_etc3,
        elect_summer1,
        elect_summer2,
        elect_summer3,
        elect_super,
        elect_charge_start_date,
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
   * @description 전력량요금 DB에서 해당하는 사용용도(USE_TYPE)를 가진 전력량요금 정보를 조회
   *
   * @param use_type  조회 대상 전력량 요금 정보의 사용용도
   *
   * @returns {Promise<ElectCharge>} 사용용도에 해당하는 전력량요금 정보
   */
  async findByElectCharge(use_type: string): Promise<ElectCharge> {
    const electCharge = await this.findOne({ where: { use_type: use_type } });

    if (!electCharge) {
      throw new NotFoundException('기본요금 정보를 찾을 수 없습니다.');
    } else {
      return electCharge;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 전력량요금 DB에서 해당하는 사용용도(USE_TYPE)를 가진 전력량요금 정보를 수정
   *
   * @param use_type  수정 대상 전력량 요금 정보의 사용용도
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditElectCharge(
    elect_charge_idx: string,
    charge: ElectChargeDto,
  ): Promise<boolean> {
    const {
      elect_etc1,
      elect_etc2,
      elect_etc3,
      elect_summer1,
      elect_summer2,
      elect_summer3,
      elect_super,
      elect_charge_start_date,
      use_type,
    } = charge;

    const editResult = await this.update(
      { elect_charge_idx },
      {
        elect_etc1,
        elect_etc2,
        elect_etc3,
        elect_summer1,
        elect_summer2,
        elect_summer3,
        elect_super,
        elect_charge_start_date,
        use_type,
      },
    );

    if (editResult.affected !== 1) {
      throw new NotFoundException('해당 요금정보는 존재하지 않습니다.');
    } else {
      return true;
    }
  }
}
