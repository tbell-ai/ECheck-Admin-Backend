import { Discount } from 'src/discount/discount.entity';
import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'contract' })
@Unique(['contract_idx'])
export class Contract extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  contract_idx: string;

  @Column({
    name: 'contract_before_elect',
    type: 'int',
    comment: '전월지침',
  })
  contract_before_elect: number;

  @Column({
    name: 'contract_last_date',
    type: 'datetime',
    comment: '월 사용 종료일',
  })
  contract_last_date: Date;

  @Column({
    name: 'contract_use',
    type: 'varchar',
    comment: '사용 용도',
  })
  contract_use: string;

  @Column({
    name: 'contract_house',
    type: 'varchar',
    comment: '주거 구분',
  })
  contract_house: string;

  @CreateDateColumn({
    name: 'contract_create_date',
    comment: '최초 생성일',
  })
  contract_create_date: Date;

  @UpdateDateColumn({
    name: 'contract_modify_date',
    comment: '마지막 수정일',
  })
  contract_modify_date: Date;

  @OneToOne(() => User, user => user.contract)
  user: User;

  @OneToMany(() => Discount, discount => discount.contract)
  discount: Discount;
}
