import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'faq' })
@Unique(['faq_idx'])
export class Faq extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  faq_idx: string;

  @Column({
    name: 'faq_type',
    type: 'varchar',
    comment: 'faq 유형',
  })
  faq_type: string;

  @Column({
    name: 'faq_post_type',
    type: 'varchar',
    comment: 'faq 게시유형',
  })
  faq_post_type: string;

  @Column({
    name: 'faq_post_start_date',
    type: 'datetime',
    comment: 'faq 게시시작일',
  })
  faq_post_start_date: Date;

  @Column({
    name: 'faq_post_end_date',
    type: 'datetime',
    comment: 'faq 게시종료일',
  })
  faq_post_end_date: Date;

  @Column({
    name: 'faq_question',
    type: 'varchar',
    comment: 'faq 질문',
  })
  faq_question: string;

  @Column({
    name: 'faq_answer',
    type: 'varchar',
    comment: 'faq 답변',
  })
  faq_answer: string;

  @CreateDateColumn({
    name: 'faq_create_date',
    comment: '최초 생성일',
  })
  faq_create_date: Date;

  @UpdateDateColumn({
    name: 'faq_modify_date',
    comment: '마지막 수정일',
  })
  faq_modify_date: Date;
}
