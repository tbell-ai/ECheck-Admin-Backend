import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Discount } from './discount.entity';
import { DiscountDto } from './dto/discount.dto';

@EntityRepository(Discount)
export class DiscountRepository extends Repository<Discount> {
  /**
   * @author 박현진 팀장
   * @description 신규 할인 정보를 DB에 Insert하는 메서드
   *
   * @param discountDto  신규 계약정보 데이터를 담은 객체
   *
   * @returns {Promise<Discount>}
   */
  async onCreateDiscount(discountDto: DiscountDto): Promise<Discount> {
    try {
      const {
        discount_bigfamily_yn,
        discount_bigfamily,
        discount_lifedevice_yn,
        discount_welfare_yn,
        discount_welfare,
      } = discountDto;

      return await this.save({
        discount_bigfamily_yn,
        discount_bigfamily:
          discount_bigfamily === ' ' ? null : discount_bigfamily,
        discount_lifedevice_yn,
        discount_welfare_yn,
        discount_welfare: discount_welfare === ' ' ? null : discount_welfare,
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
   * @description DB에서 해당하는 고유번호(IDX)를 가진 할인정보를 조회
   *
   * @param discount_idx  조회 대상 할인정보의 고유번호
   *
   * @returns {Promise<Discount>}
   */
  async findByDiscountIdx(discount_idx: string): Promise<Discount> {
    const discount = await this.findOne({
      where: { discount_idx: discount_idx },
    });

    if (!discount) {
      throw new NotFoundException('해당 할인정보를 찾을 수 없습니다.');
    } else {
      return discount;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)를 가진 할인 정보를 수정
   *
   * @param discount_idx  수정 대상 할인정보의 고유번호
   * @param discount      수정 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditDiscount(
    discount_idx: string,
    discount: DiscountDto,
  ): Promise<boolean> {
    const editResult = await this.update(
      { discount_idx },
      {
        discount_bigfamily_yn: discount.discount_bigfamily_yn,
        discount_bigfamily:
          discount.discount_bigfamily === ' '
            ? null
            : discount.discount_bigfamily,
        discount_lifedevice_yn: discount.discount_lifedevice_yn,
        discount_welfare_yn: discount.discount_welfare_yn,
        discount_welfare:
          discount.discount_welfare === ' ' ? null : discount.discount_welfare,
      },
    );

    if (editResult.affected !== 1) {
      throw new NotFoundException('해당 할인 정보가 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)를 가진 할인정보를 삭제
   *
   * @param discount_idx  삭제 대상 할인 정보의 고유번호
   *
   * @returns {Promise<boolean>}
   */
  async onDeleteDiscount(discount_idx: string): Promise<boolean> {
    const deleteDiscount = await this.delete(discount_idx);

    if (deleteDiscount.affected === 0) {
      throw new NotFoundException('해당하는 할인정보가 존재하지 않습니다.');
    } else {
      return true;
    }
  }
}
