import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @description 유저 정보를 담는 객체
 *
 */
export class CreateUserDto {
  @ApiProperty({
    example: 'tbell123',
    description: '회원 아이디',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  user_id: string; // 유저 아이디

  @ApiProperty({
    example: 'Tbell1234!!',
    description: '회원 비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  // 최소 8자 및 최대 16자, 하나 이상의 대문자, 하나의 소문자, 하나의 숫자 및 하나의 특수 문자
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
    {
      message: '비밀번호 양식에 맞게 작성하세요.',
    },
  )
  user_password: string;

  @ApiProperty({
    example: '닉네임123',
    description: '회원 닉네임',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  user_nickname: string;

  @ApiProperty({
    example: 'abc@tbell.co.kr',
    description: '회원 이메일',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(100)
  // 최소 8자 및 최대 16자, 하나 이상의 대문자, 하나의 소문자, 하나의 숫자 및 하나의 특수 문자
  @Matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$/, {
    message: '이메일 양식에 맞게 작성하세요.',
  })
  user_email: string;

  @ApiProperty({
    example: '0',
    description: '이메일 인증여부',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  user_email_yn: number;

  @ApiProperty({
    example: '1',
    description: '서비스 이용약관 동의여부',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  user_term_yn: number;

  @ApiProperty({
    example: '1',
    description: '개인정보 수집 및 이용 동의여부',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  user_collection_yn: number;

  @ApiProperty({
    example: '1',
    description: '개인정보 처리방침 동의여부',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  user_privacy_yn: number;
}

/**
 * @description 유저 수정 정보를 담는 객체
 *
 */
export class UpdateUserDto {
  @ApiProperty({
    example: 'Tbell1234!!',
    description: '회원 비밀번호',
  })
  @IsString()
  @IsNotEmpty()
  user_password: string;

  @ApiProperty({
    example: '닉네임123',
    description: '회원 닉네임',
  })
  @IsString()
  @IsNotEmpty()
  user_nickname: string;

  @ApiProperty({
    example: 'abc@tbell.co.kr',
    description: '회원 이메일',
  })
  @IsString()
  @IsNotEmpty()
  user_email: string;
}

export class SignInDto {
  @ApiProperty({
    example: 'tbell123',
    description: '회원 아이디',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty({
    example: 'Tbell1234!!',
    description: '회원 비밀번호',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  // 최소 8자 및 최대 16자 하나의 소문자, 하나의 숫자 및 하나의 특수 문자
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/, {
    message: '비밀번호 양식에 맞게 작성하세요.',
  })
  user_password: string;
}

export class StateDto {
  @ApiProperty({
    example: 'cea1d926-6f1b-4a37-a46c-8ddf0b17a0bc',
    description: '회원 고유번호',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  user_idx: string;

  @ApiProperty({
    example: 'active',
    description: '회원 상태',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  user_state: string;
}
