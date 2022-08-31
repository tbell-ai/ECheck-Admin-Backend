import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import {
  CommonChargeDto,
  DiscountChargeDto,
  EnvironmentChargeDto,
  RequirementChargeDto,
  TaxChargeDto,
} from '../dto/charge.common.dto';
import { CommonCharge } from '../entity/charge.common.entity';

@EntityRepository(CommonCharge)
export class CommonChargeRepository extends Repository<CommonCharge> {
  /**
   * @author 박현진 팀장
   * @description DB에 새로운 공통요금 정보를 입력함
   *
   * @param charge  신규 생성할 공통요금 정보를 담은 객체
   *
   * @returns {Promise<CommonCharge>} 신규 생성된 공통요금 정보
   */
  async onCreateCommonCharge(charge: CommonChargeDto): Promise<CommonCharge> {
    try {
      const {
        environment_charge,
        fuel_ratio_charge,
        require_charge_low,
        require_charge_high,
        welfare1_etc_limit,
        welfare1_summer_limit,
        welfare2_etc_limit,
        welfare2_summer_limit,
        welfare3_etc_limit,
        welfare3_summer_limit,
        welfare4_etc_limit,
        welfare4_summer_limit,
        bigfamily_percent,
        bigfamily_limit,
        lifedevice_percent,
        elect_tax,
        elect_fund,
      } = charge;

      return await this.save({
        environment_charge,
        fuel_ratio_charge,
        require_charge_low,
        require_charge_high,
        welfare1_etc_limit,
        welfare1_summer_limit,
        welfare2_etc_limit,
        welfare2_summer_limit,
        welfare3_etc_limit,
        welfare3_summer_limit,
        welfare4_etc_limit,
        welfare4_summer_limit,
        bigfamily_percent,
        bigfamily_limit,
        lifedevice_percent,
        elect_tax,
        elect_fund,
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
   * @description 공통요금 DB에서 해당하는 고유번호(common_charge_idx)를 가진 공통요금 정보를 조회
   *
   * @param common_charge_idx  조회 대상 공통 요금 정보의 고유번호
   *
   * @returns {Promise<CommonCharge>} 해당하는 공통요금 정보
   */
  async findByCommonCharge(common_charge_idx: string): Promise<CommonCharge> {
    const commonCharge = await this.findOne({
      where: { common_charge_idx: common_charge_idx },
    });

    if (!commonCharge) {
      throw new NotFoundException('기본요금 정보를 찾을 수 없습니다.');
    } else {
      return commonCharge;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 공통요금 DB에서 해당하는 고유번호(common_charge_idx)를 가진 공통요금 정보를 수정
   *
   * @param common_charge_idx   조회 대상 공통 요금 정보의 고유번호
   * @param charge              수정할 공통요금 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditCommonCharge(
    common_charge_idx: string,
    charge: CommonChargeDto,
  ): Promise<boolean> {
    const {
      environment_charge,
      fuel_ratio_charge,
      require_charge_low,
      require_charge_high,
      welfare1_etc_limit,
      welfare1_summer_limit,
      welfare2_etc_limit,
      welfare2_summer_limit,
      welfare3_etc_limit,
      welfare3_summer_limit,
      welfare4_etc_limit,
      welfare4_summer_limit,
      bigfamily_percent,
      bigfamily_limit,
      lifedevice_percent,
      elect_tax,
      elect_fund,
    } = charge;

    const editResult = await this.update(
      { common_charge_idx },
      {
        environment_charge,
        fuel_ratio_charge,
        require_charge_low,
        require_charge_high,
        welfare1_etc_limit,
        welfare1_summer_limit,
        welfare2_etc_limit,
        welfare2_summer_limit,
        welfare3_etc_limit,
        welfare3_summer_limit,
        welfare4_etc_limit,
        welfare4_summer_limit,
        bigfamily_percent,
        bigfamily_limit,
        lifedevice_percent,
        elect_tax,
        elect_fund,
      },
    );

    if (editResult.affected !== 1) {
      throw new NotFoundException('해당 요금정보는 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 공통요금 DB에서 해당하는 고유번호(common_charge_idx)를 가진 공통요금 정보에서 환경 요금만 조회
   *
   * @param common_charge_idx  조회 대상 공통 요금 정보의 고유번호
   *
   * @returns {Promise<EnvironmentCharge>} 해당하는 공통요금 정보
   */
  async findByEnvironmentCharge(common_charge_idx: string): Promise<any> {
    const environmentCharge = await this.findOne({
      select: ['common_charge_idx', 'environment_charge', 'fuel_ratio_charge'],
      where: { common_charge_idx: common_charge_idx },
    });

    if (!environmentCharge) {
      throw new NotFoundException('환경요금 정보를 찾을 수 없습니다.');
    } else {
      return environmentCharge;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 공통요금 DB에서 해당하는 고유번호(common_charge_idx)를 가진 공통요금 정보의 환경 요금을 수정
   *
   * @param common_charge_idx   조회 대상 공통 요금 정보의 고유번호
   * @param charge              수정할 환경요금 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditEnvironmentCharge(
    common_charge_idx: string,
    charge: EnvironmentChargeDto,
  ): Promise<boolean> {
    const { environment_charge, fuel_ratio_charge } = charge;

    const editResult = await this.update(
      { common_charge_idx },
      {
        environment_charge,
        fuel_ratio_charge,
      },
    );

    if (editResult.affected !== 1) {
      throw new NotFoundException('해당 요금정보는 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 공통요금 DB에서 해당하는 고유번호(common_charge_idx)를 가진 공통요금 정보에서 필수사용량 보장공제 요금만 조회
   *
   * @param common_charge_idx  조회 대상 공통 요금 정보의 고유번호
   *
   * @returns {Promise<any>} 해당하는 공통요금 정보
   */
  async findByRequirementCharge(common_charge_idx: string): Promise<any> {
    const requirementCharge = await this.findOne({
      select: [
        'common_charge_idx',
        'require_charge_low',
        'require_charge_high',
      ],
      where: { common_charge_idx: common_charge_idx },
    });

    if (!requirementCharge) {
      throw new NotFoundException(
        '필수사용량 보장공제 요금 정보를 찾을 수 없습니다.',
      );
    } else {
      return requirementCharge;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 공통요금 DB에서 해당하는 고유번호(common_charge_idx)를 가진 공통요금 정보의 필수사용량 보장공제 요금을 수정
   *
   * @param common_charge_idx   조회 대상 공통 요금 정보의 고유번호
   * @param charge              수정할 필수사용량 보장공제 요금 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditRequirementCharge(
    common_charge_idx: string,
    charge: RequirementChargeDto,
  ): Promise<boolean> {
    const { require_charge_low, require_charge_high } = charge;

    const editResult = await this.update(
      { common_charge_idx },
      {
        require_charge_low,
        require_charge_high,
      },
    );

    if (editResult.affected !== 1) {
      throw new NotFoundException('해당 요금정보는 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 공통요금 DB에서 해당하는 고유번호(common_charge_idx)를 가진 공통요금 정보에서 할인 요금만 조회
   *
   * @param common_charge_idx  조회 대상 공통 요금 정보의 고유번호
   *
   * @returns {Promise<any>} 해당하는 공통요금 정보
   */
  async findByDiscountCharge(common_charge_idx: string): Promise<any> {
    const discountCharge = await this.findOne({
      select: [
        'common_charge_idx',
        'welfare1_etc_limit',
        'welfare1_summer_limit',
        'welfare2_etc_limit',
        'welfare2_summer_limit',
        'welfare3_etc_limit',
        'welfare3_summer_limit',
        'welfare4_etc_limit',
        'welfare4_summer_limit',
        'bigfamily_percent',
        'bigfamily_limit',
        'lifedevice_percent',
      ],
      where: { common_charge_idx: common_charge_idx },
    });

    if (!discountCharge) {
      throw new NotFoundException('할인요금 정보를 찾을 수 없습니다.');
    } else {
      return discountCharge;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 공통요금 DB에서 해당하는 고유번호(common_charge_idx)를 가진 공통요금 정보의 할인 요금을 수정
   *
   * @param common_charge_idx   조회 대상 공통 요금 정보의 고유번호
   * @param charge              수정할 할인 요금 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditDiscountCharge(
    common_charge_idx: string,
    charge: DiscountChargeDto,
  ): Promise<boolean> {
    const {
      welfare1_etc_limit,
      welfare1_summer_limit,
      welfare2_etc_limit,
      welfare2_summer_limit,
      welfare3_etc_limit,
      welfare3_summer_limit,
      welfare4_etc_limit,
      welfare4_summer_limit,
      bigfamily_percent,
      bigfamily_limit,
      lifedevice_percent,
    } = charge;

    const editResult = await this.update(
      { common_charge_idx },
      {
        welfare1_etc_limit,
        welfare1_summer_limit,
        welfare2_etc_limit,
        welfare2_summer_limit,
        welfare3_etc_limit,
        welfare3_summer_limit,
        welfare4_etc_limit,
        welfare4_summer_limit,
        bigfamily_percent,
        bigfamily_limit,
        lifedevice_percent,
      },
    );

    if (editResult.affected !== 1) {
      throw new NotFoundException('해당 요금정보는 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 공통요금 DB에서 해당하는 고유번호(common_charge_idx)를 가진 공통요금 정보에서 세금관련 요금만 조회
   *
   * @param common_charge_idx  조회 대상 공통 요금 정보의 고유번호
   *
   * @returns {Promise<any>} 해당하는 공통요금 정보
   */
  async findByTaxCharge(common_charge_idx: string): Promise<any> {
    const requirementCharge = await this.findOne({
      select: ['common_charge_idx', 'elect_tax', 'elect_fund'],
      where: { common_charge_idx: common_charge_idx },
    });

    if (!requirementCharge) {
      throw new NotFoundException('세금관련 요금 정보를 찾을 수 없습니다.');
    } else {
      return requirementCharge;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 공통요금 DB에서 해당하는 고유번호(common_charge_idx)를 가진 공통요금 정보의 세금관련 요금을 수정
   *
   * @param common_charge_idx   조회 대상 공통 요금 정보의 고유번호
   * @param charge              수정할 세금관련 요금 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditTaxCharge(
    common_charge_idx: string,
    charge: TaxChargeDto,
  ): Promise<boolean> {
    const { elect_tax, elect_fund } = charge;

    const editResult = await this.update(
      { common_charge_idx },
      {
        elect_tax,
        elect_fund,
      },
    );

    if (editResult.affected !== 1) {
      throw new NotFoundException('해당 요금정보는 존재하지 않습니다.');
    } else {
      return true;
    }
  }
}
