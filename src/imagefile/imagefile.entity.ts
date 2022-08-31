import { Campaign } from 'src/campaign/campaign.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'imagefile' })
@Unique(['imagefile_idx'])
export class ImageFile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  imagefile_idx: string;

  @Column({
    name: 'imagefile_origin_filename',
    type: 'varchar',
    comment: '원래 이미지 파일명',
  })
  imagefile_origin_filename: string;

  @Column({
    name: 'imagefile_save_filename',
    type: 'varchar',
    comment: '저장 이미지 파일명',
  })
  imagefile_save_filename: string;

  @Column({
    name: 'imagefile_extension',
    type: 'varchar',
    comment: '이미지 파일 확장자',
  })
  imagefile_extension: string;

  @Column({
    name: 'imagefile_path',
    type: 'varchar',
    comment: '이미지 파일경로',
  })
  imagefile_path: string;

  @Column({
    name: 'imagefile_size',
    type: 'varchar',
    comment: '이미지 파일의 사이즈',
  })
  imagefile_size: number;

  @CreateDateColumn({
    name: 'imagefile_create_date',
    comment: '최초 생성일',
  })
  imagefile_create_date: Date;

  @ManyToOne(() => Campaign, campaign => campaign.imageFile, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  campaign: Campaign;
}
