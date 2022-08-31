import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, PaginationOptions } from 'src/paginate';
import { Contract } from './contract.entity';
import { ContractRepository } from './contract.repository';
import { ContractDto } from './dto/contract.dto';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractRepository)
    private contractRepository: ContractRepository,
  ) {}

  /**
   * @author 박현진 팀장
   * @description 신규 계약정보를 생성하는 비즈니스 로직
   *
   * @param contractDto 신규 계약 정보를 담은 객체
   *
   * @returns {Promise<Contract>} 생성된 contract 정보를 반환합니다.
   */
  async onCreateContract(contractDto: ContractDto): Promise<Contract> {
    return await this.contractRepository.onCreateContract(contractDto);
  }

  /**
   * @author 박현진 팀장
   * @description 계약정보 목록을 조회하는 API
   *
   * @param options  페이징을 위한 옵션값을 담은 객체
   *
   * @returns {Contract[]}
   */
  async getContractList(
    options: PaginationOptions,
  ): Promise<Pagination<Contract>> {
    const { take, page } = options;
    const [results, total] = await this.contractRepository.findAndCount({
      select: [
        'contract_idx',
        'contract_before_elect',
        'contract_last_date',
        'contract_use',
        'contract_house',
        'contract_create_date',
        'contract_modify_date',
      ],
      take: take,
      skip: take * (page - 1),
      order: { contract_create_date: 'DESC' },
    });

    return new Pagination<Contract>({
      results,
      total,
    });
  }

  /**
   * @author 박현진 팀장
   * @description 계약정보 고유번호(IDX)를 통해 단일 계약정보를 조회하는 API
   *
   * @param contract_idx  계약정보 고유번호
   *
   * @returns {Contract}  조회된 계약정보의 상세 정보를 리턴함
   */
  async readByOneContract(contract_idx: string): Promise<Contract> {
    return await this.contractRepository.findByContractIdx(contract_idx);
  }

  /**
   * @author 박현진 팀장
   * @description 계약정보 고유번호(IDX)를 통해 단일 계약정보를 수정하는 API
   *
   * @param contract_idx  계약정보 고유번호
   * @param contract      계약정보 수정 값를 담은 객체
   *
   * @returns {Promise<boolean>}  true / false
   */
  async editContract(
    contract_idx: string,
    contract: ContractDto,
  ): Promise<boolean> {
    return await this.contractRepository.onEditContract(contract_idx, contract);
  }

  /**
   * @author 박현진 팀장
   * @description 계약정보 고유번호(IDX)를 통해 단일 계약정보를 삭제하는 API
   *
   * @param contract_idx  계약정보 고유번호
   *
   * @returns {Promise<boolean>}  true / false
   */
  async deleteContract(contract_idx: string): Promise<boolean> {
    return await this.contractRepository.onDeleteContract(contract_idx);
  }
}
