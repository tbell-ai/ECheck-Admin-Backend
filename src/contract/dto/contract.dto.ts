import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ContractDto {
  @ApiProperty({
    example: 1322,
    description: '전월지침',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  contract_before_elect: number;

  @ApiProperty({
    example: '22-05-30',
    description: '월 사용 종료일',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  contract_last_date: string;

  @ApiProperty({
    example: '주택용(저압)',
    description: '사용 용도',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  contract_use: string;

  @ApiProperty({
    example: '주거용',
    description: '주거 구분',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  contract_house: string;
}
