import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CampaignDto {
  @ApiProperty({
    example: 'test',
    description: '캠페인 제목',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  campaign_title: string;

  @ApiProperty({
    example: 'active',
    description: '캠페인 사용 여부',
  })
  @IsNotEmpty()
  @IsNumber()
  campaign_view_yn: number;

  @ApiProperty({
    example: '["4eedcb4f-f674-437b-be27-e05107428cd7"]',
    description: '캠페인 파일 삭제 목록',
  })
  @IsNotEmpty()
  @IsArray()
  delete_files: string[];
}
