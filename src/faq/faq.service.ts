import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, PaginationOptions } from 'src/paginate';
import { MoreThan } from 'typeorm';
import { FaqDto } from './dto/faq.dto';
import { Faq } from './faq.entity';
import { FaqRepository } from './faq.repository';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(FaqRepository)
    private faqRepository: FaqRepository,
  ) {}

  /**
   * @author 박현진 팀장
   * @description 신규 FAQ를 생성하는 비즈니스 로직
   *
   * @param faqDto 신규 FAQ의 정보를 담은 객체
   *
   * @returns {Promise<Faq>} 생성된 FAQ 정보를 반환합니다.
   */
  async onCreateFaq(faqDto: FaqDto): Promise<any> {
    return await this.faqRepository.onCreateFaq(faqDto);
  }

  /**
   * @author 박현진 팀장
   * @description FAQ 목록을 조회하는 API
   *
   * @param options  페이징을 위한 옵션값을 담은 객체
   *
   * @returns {Faq[]}
   */
  async getFaqList(options: PaginationOptions): Promise<Pagination<Faq>> {
    const { take, page } = options;
    const [results, total] = await this.faqRepository.findAndCount({
      select: [
        'faq_idx',
        'faq_type',
        'faq_post_type',
        'faq_post_start_date',
        'faq_post_end_date',
        'faq_question',
        'faq_answer',
      ],
      //   where: [     where절을 배열로 두면 OR 연산, 객체로 두면 AND 연산
      //     {
      //       faq_post_start_date: Between(A, B), Between문 함수로 구현 가능
      //     },
      //     {
      //       faq_post_end_date: Between(A, B),
      //     },
      //   ],
      where: {
        faq_post_start_date: MoreThan(
          // 비교연산은 LessThan, LessThanEqual, MoreThan, MoreThanEqual 사용
          new Date(new Date().setDate(new Date().getDate() - 1))
            .toISOString()
            .replace('T', ' ')
            .replace(/\..*/, ''),
        ),
      },
      take: take,
      skip: take * (page - 1),
      order: { faq_create_date: 'DESC' },
    });

    return new Pagination<Faq>({
      results,
      total,
    });
  }

  /**
   * @author 박현진 팀장
   * @description FAQ 고유번호(IDX)를 통해 단일 FAQ를 조회하는 API
   *
   * @param faq_idx  FAQ 고유번호
   *
   * @returns {Faq}  조회된 FAQ의 상세 정보를 리턴함
   */
  async readByOneFaq(faq_idx: string): Promise<Faq> {
    return await this.faqRepository.findByFaqIdx(faq_idx);
  }

  /**
   * @author 박현진 팀장
   * @description FAQ 고유번호(IDX)를 통해 단일 FAQ를 수정하는 API
   *
   * @param faq_idx  FAQ 고유번호
   *
   * @returns {Promise<boolean>}  true / false
   */
  async editFaq(faq_idx: string, faq: FaqDto): Promise<boolean> {
    return await this.faqRepository.onEditFaq(faq_idx, faq);
  }

  /**
   * @author 박현진 팀장
   * @description FAQ 고유번호(IDX)를 통해 단일 FAQ를 삭제하는 API
   *
   * @param faq_idx  FAQ 고유번호
   *
   * @returns {Promise<boolean>}  true / false
   */
  async deleteFaq(faq_idx: string): Promise<boolean> {
    return await this.faqRepository.onDeleteFaq(faq_idx);
  }
}
