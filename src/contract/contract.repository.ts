import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Contract } from './contract.entity';
import { ContractDto } from './dto/contract.dto';

@EntityRepository(Contract)
export class ContractRepository extends Repository<Contract> {
  /**
   * @author 박현진 팀장
   * @description 신규 계약 정보를 DB에 Insert하는 메서드
   *
   * @param contractDto  신규 계약정보 데이터를 담은 객체
   *
   * @returns {Promise<Contract>}
   */
  async onCreateContract(contractDto: ContractDto): Promise<Contract> {
    try {
      const {
        contract_before_elect,
        contract_last_date,
        contract_use,
        contract_house,
      } = contractDto;

      return await this.save({
        contract_before_elect,
        contract_last_date,
        contract_use,
        contract_house,
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
   * @description DB에서 해당하는 고유번호(IDX)를 가진 계약정보를 조회
   *
   * @param contract_idx  조회 대상 계약정보의 고유번호
   *
   * @returns {Promise<Contract>}
   */
  async findByContractIdx(contract_idx: string): Promise<Contract> {
    const contract = await this.findOne({
      where: { contract_idx: contract_idx },
    });

    if (!contract) {
      throw new NotFoundException('해당 계약정보를 찾을 수 없습니다.');
    } else {
      return contract;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)를 가진 계약 정보를 수정
   *
   * @param contract_idx  수정 대상 계약정보의 고유번호
   * @param contract      수정 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditContract(
    contract_idx: string,
    contract: ContractDto,
  ): Promise<boolean> {
    const editResult = await this.update(
      { contract_idx },
      {
        contract_before_elect: contract.contract_before_elect,
        contract_last_date: contract.contract_last_date,
        contract_use: contract.contract_use,
        contract_house: contract.contract_house,
      },
    );

    if (editResult.affected !== 1) {
      throw new NotFoundException('해당 계약 정보가 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)를 가진 계약정보를 삭제
   *
   * @param contract_idx  삭제 대상 계약정보의 고유번호
   *
   * @returns {Promise<boolean>}
   */
  async onDeleteContract(contract_idx: string): Promise<boolean> {
    const deleteContract = await this.delete(contract_idx);

    if (deleteContract.affected === 0) {
      throw new NotFoundException('해당하는 계약정보가 존재하지 않습니다.');
    } else {
      return true;
    }
  }
}
