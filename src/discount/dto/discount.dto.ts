import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DiscountDto {
  @ApiProperty({
    example: 1,
    description: '대가족 할인 여부',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  discount_bigfamily_yn: number;

  @ApiProperty({
    example: '3자녀 이상 가구',
    description: '대가족 할인 항목',
  })
  @IsNotEmpty()
  @IsString()
  discount_bigfamily: string;
  // 데이터타입을 NULL로 지정하지 않는 이상 null을 받을 수 없음, 그리고 IsString을 사용하기 위해서도 null을 받을 순 없음, 서버가 공백 1칸을 받아 null로 치환해야 함.

  @ApiProperty({
    example: 1,
    description: '생명유지장치 할인 여부',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  discount_lifedevice_yn: number;

  @ApiProperty({
    example: 1,
    description: '복지 할인 여부',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  discount_welfare_yn: number;

  @ApiProperty({
    example: '기초생활(생계, 의료)',
    description: '복지 할인 항목',
  })
  @IsNotEmpty()
  @IsString()
  discount_welfare: string;
  // 데이터타입을 NULL로 지정하지 않는 이상 null을 받을 수 없음, 그리고 IsString을 사용하기 위해서도 null을 받을 순 없음, 서버가 공백 1칸을 받아 null로 치환해야 함.
}
