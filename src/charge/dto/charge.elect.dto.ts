import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class ElectChargeDto {
  @ApiProperty({
    example: 98.1,
    description: '전력량요금 첫번째 기타 구간',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  elect_etc1: number;

  @ApiProperty({
    example: 192.7,
    description: '전력량요금 두번째 기타 구간',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  elect_etc2: number;

  @ApiProperty({
    example: 285.4,
    description: '전력량요금 세번째 기타 구간',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  elect_etc3: number;

  @ApiProperty({
    example: 98.1,
    description: '전력량요금 첫번째 하계 구간',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  elect_summer1: number;

  @ApiProperty({
    example: 192.7,
    description: '전력량요금 두번째 하계 구간',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  elect_summer2: number;

  @ApiProperty({
    example: 258.4,
    description: '전력량요금 세번째 하계 구간',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  elect_summer3: number;

  @ApiProperty({
    example: 714.3,
    description: '전력량요금 슈퍼유저 (하계/기타) 구간',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  elect_super: number;

  @ApiProperty({
    example: '2022-05-25',
    description: '해당 요금정보 적용 날짜(분기별로 변경됨)',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  elect_charge_start_date: string;

  @ApiProperty({
    example: '주택용(저압)',
    description: '전력 사용용도 구분 필드',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  use_type: string;
}
