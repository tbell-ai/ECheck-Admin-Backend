import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'default_charge' })
@Unique(['default_charge_idx'])
export class DefaultCharge extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  default_charge_idx: string;

  @Column({
    name: 'default_etc1',
    type: 'int',
    comment: '기타 계절 1구간',
  })
  default_etc1: number;

  @Column({
    name: 'default_etc2',
    type: 'int',
    comment: '기타 계절 2구간',
  })
  default_etc2: number;

  @Column({
    name: 'default_etc3',
    type: 'int',
    comment: '기타 계절 3구간',
  })
  default_etc3: number;

  @Column({
    name: 'default_summer1',
    type: 'int',
    comment: '하계 1구간',
  })
  default_summer1: number;

  @Column({
    name: 'default_summer2',
    type: 'int',
    comment: '하계 2구간',
  })
  default_summer2: number;

  @Column({
    name: 'default_summer3',
    type: 'int',
    comment: '하계 3구간',
  })
  default_summer3: number;

  @Column({
    name: 'use_type',
    type: 'varchar',
    length: 20,
    comment: '사용 용도',
  })
  use_type: string;

  @Column({
    name: 'default_charge_start_date',
    type: 'varchar',
    comment: '공식 적용날짜',
  })
  default_charge_start_date: string;

  @CreateDateColumn({
    name: 'default_charge_create_date',
    comment: '최초 생성일',
  })
  default_charge_create_date: Date;

  @UpdateDateColumn({
    name: 'default_charge_last_modify_date',
    comment: '마지막 수정일자',
  })
  default_charge_last_modify_date: Date;
}
