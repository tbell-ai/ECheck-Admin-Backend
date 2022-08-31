import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Faq } from './faq.entity';
import { FaqDto } from './dto/faq.dto';

@EntityRepository(Faq)
export class FaqRepository extends Repository<Faq> {
  /**
   * @author 박현진 팀장
   * @description 신규 FAQ를 DB에 Insert하는 메서드
   *
   * @param faqDto  신규 FAQ 데이터를 담은 객체
   *
   * @returns {Promise<Faq>}
   */
  async onCreateFaq(faqDto: FaqDto): Promise<Faq> {
    try {
      const {
        faq_type,
        faq_post_type,
        faq_post_start_date,
        faq_post_end_date,
        faq_question,
        faq_answer,
      } = faqDto;

      return await this.save({
        faq_type,
        faq_post_type,
        faq_post_start_date,
        faq_post_end_date,
        faq_question,
        faq_answer,
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
   * @description DB에서 해당하는 고유번호(IDX)를 가진 FAQ 정보를 조회
   *
   * @param faq_idx  조회 대상 버전의 고유번호
   *
   * @returns {Promise<Faq>}
   */
  async findByFaqIdx(faq_idx: string): Promise<Faq> {
    const faq = await this.findOne({ where: { faq_idx: faq_idx } });

    if (!faq) {
      throw new NotFoundException('해당 버전을 찾을 수 없습니다.');
    } else {
      return faq;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)를 가진 FAQ 정보를 수정
   *
   * @param faq_idx  수정 대상 FAQ의 고유번호
   * @param faq      수정 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditFaq(faq_idx: string, faq: FaqDto): Promise<boolean> {
    const editResult = await this.update(
      { faq_idx },
      {
        faq_type: faq.faq_type,
        faq_post_type: faq.faq_post_type,
        faq_post_start_date: faq.faq_post_start_date,
        faq_post_end_date: faq.faq_post_end_date,
        faq_question: faq.faq_question,
        faq_answer: faq.faq_answer,
      },
    );

    if (editResult.affected !== 1) {
      throw new NotFoundException('해당 FAQ가 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)를 가진 FAQ 정보를 삭제
   *
   * @param faq_idx  삭제 대상 FAQ의 고유번호
   *
   * @returns {Promise<boolean>}
   */
  async onDeleteFaq(faq_idx: string): Promise<boolean> {
    const deleteFaq = await this.delete(faq_idx);

    if (deleteFaq.affected === 0) {
      throw new NotFoundException('해당하는 FAQ가 존재하지 않습니다.');
    } else {
      return true;
    }
  }
}
