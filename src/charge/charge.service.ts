import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultCharge } from './entity/charge.default.entity';
import { DefaultChargeRepository } from './repository/charge.default.repository';
import { ElectCharge } from './entity/charge.elect.entity';
import { ElectChargeRepository } from './repository/charge.elect.repository';
import { DefaultChargeDto } from './dto/charge.default.dto';
import { ElectChargeDto } from './dto/charge.elect.dto';
import {
  CommonChargeDto,
  DiscountChargeDto,
  EnvironmentChargeDto,
  RequirementChargeDto,
  TaxChargeDto,
} from './dto/charge.common.dto';
import { CommonChargeRepository } from './repository/charge.common.repository';
import { CommonCharge } from './entity/charge.common.entity';

@Injectable()
export class ChargeService {
  constructor(
    @InjectRepository(ElectChargeRepository)
    private electChargeRepository: ElectChargeRepository,
    @InjectRepository(DefaultChargeRepository)
    private defaultChargeRepository: DefaultChargeRepository,
    @InjectRepository(CommonChargeRepository)
    private commonChargeRepository: CommonChargeRepository,
  ) {}

  /**
   * @author 박현진 팀장
   * @description 신규 기본요금 정보를 생성하는 비즈니스 로직
   *
   * @param charge 신규 생성 대상 기본요금 정보를 담은 객체
   *
   * @returns {Promise<DefaultCharge>} 신규 생성이 완료된 기본요금 정보
   */
  async onCreateDefaultCharge(
    charge: DefaultChargeDto,
  ): Promise<DefaultCharge> {
    return await this.defaultChargeRepository.onCreateDefaultCharge(charge);
  }

  /**
   * @author 박현진 팀장
   * @description 기본요금 정보를 수정하는 비즈니스 로직
   *
   * @param default_charge_idx  수정 대상 기본요금의 고유 번호
   * @param charge              수정 대상 기본요금 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditDefaultCharge(
    default_charge_idx: string,
    charge: DefaultChargeDto,
  ): Promise<boolean> {
    return await this.defaultChargeRepository.onEditDefaultCharge(
      default_charge_idx,
      charge,
    );
  }

  /**
   * @author 박현진 팀장
   * @description 사용 용도에 맞는 기본요금 정보를 조회하는 비즈니스 로직
   *
   * @param use_type 대상 기본요금 정보를 조회하기 위한 사용 용도
   *
   * @returns {Promise<DefaultCharge>} 조회된 기본요금 정보
   */
  async getDefaultCharge(use_type: string): Promise<DefaultCharge> {
    return await this.defaultChargeRepository.findByDefaultCharge(use_type);
  }

  /**
   * @author 박현진 팀장
   * @description 신규 전력량요금 정보를 생성하는 비즈니스 로직
   *
   * @param charge 신규 생성 대상 전력량요금 정보를 담은 객체
   *
   * @returns {Promise<ElectCharge>} 신규 생성이 완료된 전력량요금 정보
   */
  async onCreateElectCharge(charge: ElectChargeDto): Promise<ElectCharge> {
    return await this.electChargeRepository.onCreateElectCharge(charge);
  }

  /**
   * @author 박현진 팀장
   * @description 전력량요금 정보를 수정하는 비즈니스 로직
   *
   * @param elect_charge_idx  수정 대상 전력량요금의 고유 번호
   * @param charge            수정 대상 전력량요금 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditElectCharge(
    elect_charge_idx: string,
    charge: ElectChargeDto,
  ): Promise<boolean> {
    return await this.electChargeRepository.onEditElectCharge(
      elect_charge_idx,
      charge,
    );
  }

  /**
   * @author 박현진 팀장
   * @description 사용 용도에 맞는 전력량요금 정보를 조회하는 비즈니스 로직
   *
   * @param use_type 대상 전력량요금 정보를 조회하기 위한 사용 용도
   *
   * @returns {Promise<DefaultCharge>} 조회된 전력량요금 정보
   */
  async getElectCharge(use_type: string): Promise<ElectCharge> {
    return await this.electChargeRepository.findByElectCharge(use_type);
  }

  /**
   * @author 박현진 팀장
   * @description 신규 공통요금 정보를 생성하는 비즈니스 로직
   *
   * @param charge 신규 생성 대상 공통요금 정보를 담은 객체
   *
   * @returns {Promise<CommonCharge>} 신규 생성이 완료된 공통요금 정보
   */
  async onCreateCommonCharge(charge: CommonChargeDto): Promise<CommonCharge> {
    return await this.commonChargeRepository.onCreateCommonCharge(charge);
  }

  /**
   * @author 박현진 팀장
   * @description 공통요금 정보를 수정하는 비즈니스 로직
   *
   * @param common_charge_idx  수정 대상 공통요금의 고유 번호
   * @param charge            수정 대상 공통요금 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditCommonCharge(
    common_charge_idx: string,
    charge: CommonChargeDto,
  ): Promise<boolean> {
    return await this.commonChargeRepository.onEditCommonCharge(
      common_charge_idx,
      charge,
    );
  }

  /**
   * @author 박현진 팀장
   * @description 고유 번호에 맞는 공통요금 정보를 조회하는 비즈니스 로직
   *
   * @param common_charge_idx  조회 대상 공통요금의 고유 번호
   *
   * @returns {Promise<CommonCharge>} 조회된 공통요금 정보
   */
  async getCommonCharge(common_charge_idx: string): Promise<CommonCharge> {
    return await this.commonChargeRepository.findByCommonCharge(
      common_charge_idx,
    );
  }

  /**
   * @author 박현진 팀장
   * @description 고유 번호에 맞는 공통요금 정보에서 환경요금을 조회하는 비즈니스 로직
   *
   * @param common_charge_idx  조회 대상 공통요금의 고유 번호
   *
   * @returns {Promise<EnvironmentCharge>} 조회된 환경요금 정보
   */
  async getEnvironmentCharge(common_charge_idx: string): Promise<any> {
    return await this.commonChargeRepository.findByEnvironmentCharge(
      common_charge_idx,
    );
  }

  /**
   * @author 박현진 팀장
   * @description 공통요금 정보에서 환경요금 정보를 수정하는 비즈니스 로직
   *
   * @param common_charge_idx 수정 대상 공통요금의 고유 번호
   * @param charge            수정 대상 환경요금 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditEnvironmentCharge(
    common_charge_idx: string,
    charge: EnvironmentChargeDto,
  ): Promise<boolean> {
    return await this.commonChargeRepository.onEditEnvironmentCharge(
      common_charge_idx,
      charge,
    );
  }

  /**
   * @author 박현진 팀장
   * @description 고유 번호에 맞는 공통요금 정보에서 필수사용량 보장공제 요금을 조회하는 비즈니스 로직
   *
   * @param common_charge_idx  조회 대상 공통요금의 고유 번호
   *
   * @returns {Promise<EnvironmentCharge>} 조회된 필수사용량 보장공제 요금 정보
   */
  async getRequirementCharge(common_charge_idx: string): Promise<any> {
    return await this.commonChargeRepository.findByRequirementCharge(
      common_charge_idx,
    );
  }

  /**
   * @author 박현진 팀장
   * @description 공통요금 정보에서 필수사용량 보장공제 요금 정보를 수정하는 비즈니스 로직
   *
   * @param common_charge_idx 수정 대상 공통요금의 고유 번호
   * @param charge            수정 대상 필수사용량 보장공제 요금 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditRequirementCharge(
    common_charge_idx: string,
    charge: RequirementChargeDto,
  ): Promise<boolean> {
    return await this.commonChargeRepository.onEditRequirementCharge(
      common_charge_idx,
      charge,
    );
  }

  /**
   * @author 박현진 팀장
   * @description 고유 번호에 맞는 공통요금 정보에서 할인 요금을 조회하는 비즈니스 로직
   *
   * @param common_charge_idx  조회 대상 공통요금의 고유 번호
   *
   * @returns {Promise<EnvironmentCharge>} 조회된 할인 요금 정보
   */
  async getDiscountCharge(common_charge_idx: string): Promise<any> {
    return await this.commonChargeRepository.findByDiscountCharge(
      common_charge_idx,
    );
  }

  /**
   * @author 박현진 팀장
   * @description 공통요금 정보에서 할인 요금 정보를 수정하는 비즈니스 로직
   *
   * @param common_charge_idx 수정 대상 공통요금의 고유 번호
   * @param charge            수정 대상 할인 요금 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditDiscountCharge(
    common_charge_idx: string,
    charge: DiscountChargeDto,
  ): Promise<boolean> {
    return await this.commonChargeRepository.onEditDiscountCharge(
      common_charge_idx,
      charge,
    );
  }

  /**
   * @author 박현진 팀장
   * @description 고유 번호에 맞는 공통요금 정보에서 세금관련 요금을 조회하는 비즈니스 로직
   *
   * @param common_charge_idx  조회 대상 공통요금의 고유 번호
   *
   * @returns {Promise<EnvironmentCharge>} 조회된 세금관련 요금 정보
   */
  async getTaxCharge(common_charge_idx: string): Promise<any> {
    return await this.commonChargeRepository.findByTaxCharge(common_charge_idx);
  }

  /**
   * @author 박현진 팀장
   * @description 공통요금 정보에서 세금관련 요금 정보를 수정하는 비즈니스 로직
   *
   * @param common_charge_idx 수정 대상 공통요금의 고유 번호
   * @param charge            수정 대상 세금관련 요금 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditTaxCharge(
    common_charge_idx: string,
    charge: TaxChargeDto,
  ): Promise<boolean> {
    return await this.commonChargeRepository.onEditTaxCharge(
      common_charge_idx,
      charge,
    );
  }
}
