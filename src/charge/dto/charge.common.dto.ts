import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CommonChargeDto {
  @ApiProperty({
    example: 7.3,
    description: '기후환경요금',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  environment_charge: number;

  @ApiProperty({
    example: 3.0,
    description: '연료비 조정액',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  fuel_ratio_charge: number;

  @ApiProperty({
    example: 2000,
    description: '필수사용량 보장공제(저압)',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  require_charge_low: number;

  @ApiProperty({
    example: 1500,
    description: '필수사용량 보장공제(고압)',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  require_charge_high: number;

  @ApiProperty({
    example: 16000,
    description: '복지할인 장애인/유공자 기타계절',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare1_etc_limit: number;

  @ApiProperty({
    example: 20000,
    description: '복지할인 장애인/유공자 하계',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare1_summer_limit: number;

  @ApiProperty({
    example: 16000,
    description: '복지할인 기초수급(생계/의료) 기타계절',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare2_etc_limit: number;

  @ApiProperty({
    example: 20000,
    description: '복지할인 기초수급(생계/의료) 하계',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare2_summer_limit: number;

  @ApiProperty({
    example: 10000,
    description: '복지할인 기초수급(주거/교육) 기타계절',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare3_etc_limit: number;

  @ApiProperty({
    example: 12000,
    description: '복지할인 기초수급(주거/교육) 하계',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare3_summer_limit: number;

  @ApiProperty({
    example: 8000,
    description: '복지할인 차상위계층 기타계절',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare4_etc_limit: number;

  @ApiProperty({
    example: 10000,
    description: '복지할인 차상위계층 하계',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare4_summer_limit: number;

  @ApiProperty({
    example: 0.3,
    description: '대가족/3자년이상/출산가구 할인율',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  bigfamily_percent: number;

  @ApiProperty({
    example: 16000,
    description: '대가족/3자녀이상/출산가구 한도금액',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  bigfamily_limit: number;

  @ApiProperty({
    example: 0.3,
    description: '생명유지장치 할인율',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  lifedevice_percent: number;

  @ApiProperty({
    example: 0.1,
    description: '부가가치세',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  elect_tax: number;

  @ApiProperty({
    example: 0.037,
    description: '전력산업기반기금',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  elect_fund: number;
}

export class EnvironmentChargeDto {
  @ApiProperty({
    example: 7.3,
    description: '기후환경요금',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  environment_charge: number;

  @ApiProperty({
    example: 3.0,
    description: '연료비 조정액',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  fuel_ratio_charge: number;
}

export class RequirementChargeDto {
  @ApiProperty({
    example: 2000,
    description: '필수사용량 보장공제(저압)',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  require_charge_low: number;

  @ApiProperty({
    example: 1500,
    description: '필수사용량 보장공제(고압)',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  require_charge_high: number;
}

export class DiscountChargeDto {
  @ApiProperty({
    example: 16000,
    description: '복지할인 장애인/유공자 기타계절',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare1_etc_limit: number;

  @ApiProperty({
    example: 20000,
    description: '복지할인 장애인/유공자 하계',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare1_summer_limit: number;

  @ApiProperty({
    example: 16000,
    description: '복지할인 기초수급(생계/의료) 기타계절',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare2_etc_limit: number;

  @ApiProperty({
    example: 20000,
    description: '복지할인 기초수급(생계/의료) 하계',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare2_summer_limit: number;

  @ApiProperty({
    example: 10000,
    description: '복지할인 기초수급(주거/교육) 기타계절',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare3_etc_limit: number;

  @ApiProperty({
    example: 12000,
    description: '복지할인 기초수급(주거/교육) 하계',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare3_summer_limit: number;

  @ApiProperty({
    example: 8000,
    description: '복지할인 차상위계층 기타계절',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare4_etc_limit: number;

  @ApiProperty({
    example: 10000,
    description: '복지할인 차상위계층 하계',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  welfare4_summer_limit: number;

  @ApiProperty({
    example: 0.3,
    description: '대가족/3자년이상/출산가구 할인율',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  bigfamily_percent: number;

  @ApiProperty({
    example: 16000,
    description: '대가족/3자녀이상/출산가구 한도금액',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  bigfamily_limit: number;

  @ApiProperty({
    example: 0.3,
    description: '생명유지장치 할인율',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  lifedevice_percent: number;
}

export class TaxChargeDto {
  @ApiProperty({
    example: 0.1,
    description: '부가가치세',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  elect_tax: number;

  @ApiProperty({
    example: 0.037,
    description: '전력산업기반기금',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  elect_fund: number;
}
