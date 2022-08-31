import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class FaqDto {
  @ApiProperty({
    example: '오류 문의',
    description: 'FAQ 유형',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  faq_type: string;

  @ApiProperty({
    example: '상시 게시',
    description: 'FAQ 게시유형',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  faq_post_type: string;

  @ApiProperty({
    example: '2022-05-25',
    description: 'FAQ 게시시작일',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  faq_post_start_date: string;

  @ApiProperty({
    example: '2022-05-25',
    description: 'FAQ 게시종료일',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  faq_post_end_date: string;

  @ApiProperty({
    example: 'E-Check 서비스는 아이폰 지원을 하지 않나요?',
    description: 'FAQ 질문',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  faq_question: string;

  @ApiProperty({
    example: 'E-Check 서비스는 아이폰 지원을 하지 않습니다.',
    description: 'FAQ 대답',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  faq_answer: string;
}
