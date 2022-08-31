import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'version' })
@Unique(['version_idx'])
export class Version extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  version_idx: string;

  @Column({
    name: 'version_new',
    type: 'varchar',
    comment: '신규 등록 버전',
  })
  version_new: string;

  @Column({
    name: 'version_current',
    type: 'varchar',
    comment: '현재 적용 버전',
  })
  version_current: string;

  @Column({
    name: 'version_required',
    type: 'varchar',
    comment: '해당 버전 업데이트 필수 버전',
  })
  version_required: string;

  @Column({
    name: 'version_detail',
    type: 'varchar',
    comment: '버전 변경내역',
  })
  version_detail: string;

  @Column({
    name: 'version_enabled',
    type: 'tinyint',
    comment: '해당 버전 사용 유무',
  })
  version_enabled: number;

  @CreateDateColumn({
    name: 'version_create_date',
    comment: '최초 생성일',
  })
  version_create_date: Date;

  @UpdateDateColumn({
    name: 'version_modify_date',
    comment: '마지막 수정일',
  })
  version_modify_date: Date;
}
