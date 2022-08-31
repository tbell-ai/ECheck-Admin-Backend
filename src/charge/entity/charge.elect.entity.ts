import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'elect_charge' })
@Unique(['elect_charge_idx'])
export class ElectCharge extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  elect_charge_idx: string;

  @Column({
    name: 'elect_etc1',
    type: 'float',
    comment: '기타 계절 1구간',
  })
  elect_etc1: number;

  @Column({
    name: 'elect_etc2',
    type: 'float',
    comment: '기타 계절 2구간',
  })
  elect_etc2: number;

  @Column({
    name: 'elect_etc3',
    type: 'float',
    comment: '기타 계절 3구간',
  })
  elect_etc3: number;

  @Column({
    name: 'elect_summer1',
    type: 'float',
    comment: '하계 1구간',
  })
  elect_summer1: number;

  @Column({
    name: 'elect_summer2',
    type: 'float',
    comment: '하계 2구간',
  })
  elect_summer2: number;

  @Column({
    name: 'elect_summer3',
    type: 'float',
    comment: '하계 3구간',
  })
  elect_summer3: number;

  @Column({
    name: 'elect_super',
    type: 'float',
    comment: '슈퍼 유저 구간',
  })
  elect_super: number;

  @Column({
    name: 'use_type',
    type: 'varchar',
    length: 20,
    comment: '사용 용도',
  })
  use_type: string;

  @Column({
    name: 'elect_charge_start_date',
    type: 'varchar',
    comment: '공식 적용날짜',
  })
  elect_charge_start_date: string;

  @CreateDateColumn({
    name: 'elect_charge_create_date',
    comment: '최초 생성일',
  })
  elect_charge_create_date: Date;

  @UpdateDateColumn({
    name: 'elect_charge_last_modify_date',
    comment: '마지막 수정일자',
  })
  elect_charge_last_modify_date: Date;
}
