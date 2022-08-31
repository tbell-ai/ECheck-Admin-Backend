import { ImageFile } from 'src/imagefile/imagefile.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'campaign' })
@Unique(['campaign_idx'])
export class Campaign extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  campaign_idx: string;

  @Column({
    name: 'campaign_title',
    type: 'varchar',
    comment: '캠페인 제목',
  })
  campaign_title: string;

  @Column({
    name: 'campaign_view_yn',
    type: 'tinyint',
    comment: '캠페인 노출 여부',
  })
  campaign_view_yn: number;

  @CreateDateColumn({
    name: 'campaign_create_date',
    comment: '최초 생성일',
  })
  campaign_create_date: Date;

  @UpdateDateColumn({
    name: 'campaign_modify_date',
    comment: '마지막 수정일',
  })
  campaign_modify_date: Date;

  @OneToMany(() => ImageFile, imageFile => imageFile.campaign)
  imageFile: ImageFile;
}
