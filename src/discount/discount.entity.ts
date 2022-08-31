import { Contract } from 'src/contract/contract.entity';
import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'discount' })
@Unique(['discount_idx'])
export class Discount extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  discount_idx: string;

  @Column({
    name: 'discount_bigfamily_yn',
    type: 'tinyint',
    comment: '대가족 할인 여부',
  })
  discount_bigfamily_yn: number;

  @Column({
    name: 'discount_bigfamily',
    type: 'varchar',
    comment: '대가족 할인 항목',
    nullable: true,
  })
  discount_bigfamily: string;

  @Column({
    name: 'discount_lifedevice_yn',
    type: 'tinyint',
    comment: '생명유지장치 할인 여부',
  })
  discount_lifedevice_yn: number;

  @Column({
    name: 'discount_welfare_yn',
    type: 'tinyint',
    comment: '복지 할인 여부',
  })
  discount_welfare_yn: number;

  @Column({
    name: 'discount_welfare',
    type: 'varchar',
    comment: '복지 할인 항목',
    nullable: true,
  })
  discount_welfare: string;

  @CreateDateColumn({
    name: 'discount_create_date',
    comment: '최초 생성일',
  })
  discount_create_date: Date;

  @UpdateDateColumn({
    name: 'discount_modify_date',
    comment: '마지막 수정일',
  })
  discount_modify_date: Date;

  @ManyToOne(() => Contract, contract => contract.discount, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_idx', referencedColumnName: 'contract_idx' })
  contract: Contract;

  @ManyToOne(() => User, user => user.discount, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_idx', referencedColumnName: 'user_idx' })
  user: User;
}
