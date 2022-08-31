import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, PaginationOptions } from 'src/paginate';
import { Discount } from './discount.entity';
import { DiscountRepository } from './discount.repository';
import { DiscountDto } from './dto/discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountRepository)
    private discountRepository: DiscountRepository,
  ) {}

  /**
   * @author 박현진 팀장
   * @description 신규 할인정보를 생성하는 비즈니스 로직
   *
   * @param discountDto 신규 할인 정보를 담은 객체
   *
   * @returns {Promise<Discount>} 생성된 discount 정보를 반환합니다.
   */
  async onCreateDiscount(discountDto: DiscountDto): Promise<Discount> {
    return await this.discountRepository.onCreateDiscount(discountDto);
  }

  /**
   * @author 박현진 팀장
   * @description 할인정보 목록을 조회하는 API
   *
   * @param options  페이징을 위한 옵션값을 담은 객체
   *
   * @returns {Discount[]}
   */
  async getDiscountList(
    options: PaginationOptions,
  ): Promise<Pagination<Discount>> {
    const { take, page } = options;
    const [results, total] = await this.discountRepository.findAndCount({
      select: [
        'discount_idx',
        'discount_bigfamily_yn',
        'discount_bigfamily',
        'discount_lifedevice_yn',
        'discount_welfare_yn',
        'discount_welfare',
        'discount_create_date',
        'discount_modify_date',
      ],
      take: take,
      skip: take * (page - 1),
      order: { discount_create_date: 'DESC' },
    });

    return new Pagination<Discount>({
      results,
      total,
    });
  }

  /**
   * @author 박현진 팀장
   * @description 할인정보 고유번호(IDX)를 통해 단일 할인정보를 조회하는 API
   *
   * @param discount_idx  할인정보 고유번호
   *
   * @returns {Discount}  조회된 할인정보의 상세 정보를 리턴함
   */
  async readByOneDiscount(discount_idx: string): Promise<Discount> {
    return await this.discountRepository.findByDiscountIdx(discount_idx);
  }

  /**
   * @author 박현진 팀장
   * @description 할인정보 고유번호(IDX)를 통해 단일 할인정보를 수정하는 API
   *
   * @param discount_idx  할인정보 고유번호
   * @param discount      할인정보 수정 값를 담은 객체
   *
   * @returns {Promise<boolean>}  true / false
   */
  async editDiscount(
    discount_idx: string,
    discount: DiscountDto,
  ): Promise<boolean> {
    return await this.discountRepository.onEditDiscount(discount_idx, discount);
  }

  /**
   * @author 박현진 팀장
   * @description 할인정보 고유번호(IDX)를 통해 단일 할인정보를 삭제하는 API
   *
   * @param discount_idx  할인정보 고유번호
   *
   * @returns {Promise<boolean>}  true / false
   */
  async deleteDiscount(discount_idx: string): Promise<boolean> {
    return await this.discountRepository.onDeleteDiscount(discount_idx);
  }
}
