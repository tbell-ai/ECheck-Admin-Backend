import { Contract } from 'src/contract/contract.entity';
import { Discount } from 'src/discount/discount.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

export const UserState = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DORMANCY: 'dormancy',
  DELETE: 'delete',
} as const;

export const UserRole = {
  ADMIN: 'admin',
  CUSTOMER: 'user',
} as const;

@Entity({ name: 'user' })
@Unique(['user_idx'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  user_idx: string;

  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: '회원 아이디',
  })
  user_id: string;

  @Column({
    name: 'user_password',
    type: 'varchar',
    length: 255,
    comment: '회원 비밀번호',
  })
  user_password: string;

  @Column({
    name: 'user_nickname',
    type: 'varchar',
    length: 30,
    comment: '회원 닉네임',
  })
  user_nickname: string;

  @Column({
    name: 'user_email',
    type: 'varchar',
    length: 100,
    comment: '회원 이메일',
  })
  user_email: string;

  @Column({
    name: 'user_email_yn',
    type: 'tinyint',
    comment: '회원 이메일 인증 여부',
  })
  user_email_yn: number;

  @Column({
    name: 'user_term_yn',
    type: 'tinyint',
    comment: '서비스 이용약관 동의 여부',
  })
  user_term_yn: number;

  @Column({
    name: 'user_collection_yn',
    type: 'tinyint',
    comment: '개인정보 수집 및 이용 동의 여부',
  })
  user_collection_yn: number;

  @Column({
    name: 'user_privacy_yn',
    type: 'tinyint',
    comment: '개인정보 처리방침 동의 여부',
  })
  user_privacy_yn: number;

  @Column({
    name: 'user_last_login_ip',
    type: 'varchar',
    length: 20,
    comment: '마지막 로그인 IP',
    default: '000.000.000.000',
  })
  user_last_login_ip: string;

  @Column({
    name: 'user_last_login_device',
    type: 'varchar',
    length: 250,
    comment: '마지막 로그인 Device',
    default: 'no history of login',
  })
  user_last_login_device: string;

  @Column({
    name: 'user_last_login_date',
    type: 'datetime',
    comment: '마지막 로그인 일시',
    default: () => 'CURRENT_TIMESTAMP',
  })
  user_last_login_date: Date;

  @CreateDateColumn({ name: 'user_create_date', comment: '최초 생성일' })
  user_create_date: Date;

  @UpdateDateColumn({ name: 'user_last_modify_date', comment: '마지막 수정일' })
  user_last_modify_date: Date;

  @Column({
    name: 'user_state',
    type: 'varchar',
    length: 10,
    comment: '회원 상태',
    default: UserState.INACTIVE,
  })
  user_state: string;

  @Column({
    name: 'user_enabled',
    type: 'tinyint',
    comment: '회원 정보 사용 여부',
    default: 1,
  })
  user_enabled: number;

  @Column({
    name: 'user_role',
    type: 'varchar',
    comment: '회원 권한',
    default: UserRole.CUSTOMER,
  })
  user_role: string;

  @Column({
    name: 'current_hashed_refresh_token',
    type: 'varchar',
    comment: '회원이 가장 마지막으로 발급받은 refresh token을 저장',
    nullable: true,
  })
  current_hashed_refresh_token: string;

  @OneToOne(() => Contract, contract => contract.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_idx', referencedColumnName: 'contract_idx' })
  contract: Contract;

  @OneToMany(() => Discount, discount => discount.user)
  discount: Discount;
}
