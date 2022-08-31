import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'common_charge' })
@Unique(['common_charge_idx'])
export class CommonCharge extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  common_charge_idx: string;

  @Column({
    name: 'environment_charge',
    type: 'float',
    comment: '기후 환경 요금',
  })
  environment_charge: number;

  @Column({
    name: 'fuel_ratio_charge',
    type: 'float',
    comment: '연료비 조정액',
  })
  fuel_ratio_charge: number;

  @Column({
    name: 'require_charge_low',
    type: 'int',
    comment: '필수사용량 보장공제(저압)',
  })
  require_charge_low: number;

  @Column({
    name: 'require_charge_high',
    type: 'int',
    comment: '필수사용량 보장공제(고압)',
  })
  require_charge_high: number;

  @Column({
    name: 'welfare1_etc_limit',
    type: 'int',
    comment: '복지할인 장애인/유공자 기타계절',
  })
  welfare1_etc_limit: number;

  @Column({
    name: 'welfare1_summer_limit',
    type: 'int',
    comment: '복지할인 장애인/유공자 하계',
  })
  welfare1_summer_limit: number;

  @Column({
    name: 'welfare2_etc_limit',
    type: 'int',
    comment: '복지할인 기초수급(생계/의료) 기타계절',
  })
  welfare2_etc_limit: number;

  @Column({
    name: 'welfare2_summer_limit',
    type: 'int',
    comment: '복지할인 기초수급(생계/의료) 하계',
  })
  welfare2_summer_limit: number;

  @Column({
    name: 'welfare3_etc_limit',
    type: 'int',
    comment: '복지할인 기초수급(주거/교육) 기타계절',
  })
  welfare3_etc_limit: number;

  @Column({
    name: 'welfare3_summer_limit',
    type: 'int',
    comment: '복지할인 기초수급(주거/교육) 하계',
  })
  welfare3_summer_limit: number;

  @Column({
    name: 'welfare4_etc_limit',
    type: 'int',
    comment: '복지할인 차상위계층 기타계절',
  })
  welfare4_etc_limit: number;

  @Column({
    name: 'welfare4_summer_limit',
    type: 'int',
    comment: '복지할인 차상위계층 하계',
  })
  welfare4_summer_limit: number;

  @Column({
    name: 'bigfamily_percent',
    type: 'float',
    comment: '대가족/3자년이상/출산가구 할인율',
  })
  bigfamily_percent: number;

  @Column({
    name: 'bigfamily_limit',
    type: 'int',
    comment: '대가족/3자녀이상/출산가구 한도금액',
  })
  bigfamily_limit: number;

  @Column({
    name: 'lifedevice_percent',
    type: 'float',
    comment: '생명유지장치 할인율',
  })
  lifedevice_percent: number;

  @Column({
    name: 'elect_tax',
    type: 'float',
    comment: '부가가치세',
  })
  elect_tax: number;

  @Column({
    name: 'elect_fund',
    type: 'float',
    comment: '전력산업기반기금',
  })
  elect_fund: number;

  @CreateDateColumn({
    name: 'common_charge_create_date',
    comment: '최초 생성일',
  })
  common_charge_create_date: Date;

  @UpdateDateColumn({
    name: 'common_charge_last_modify_date',
    comment: '마지막 수정일',
  })
  common_charge_last_modify_date: Date;
}
