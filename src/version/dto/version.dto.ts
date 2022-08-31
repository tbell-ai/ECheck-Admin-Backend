import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VersionDto {
  @ApiProperty({
    example: '1.0.0',
    description: '신규 등록 버전',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  version_new: string;

  @ApiProperty({
    example: '버그 수정으로 인한 버전 업데이트',
    description: '버전 변경내역',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  version_detail: string;
}

export class VersionUpdateDto {
  @ApiProperty({
    example: '1.0.0',
    description: '신규 등록 버전',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  version_new: string;

  @ApiProperty({
    example: '1.0.0',
    description: '현재 서비스 버전',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  version_current: string;

  @ApiProperty({
    example: '1.0.0',
    description: '업데이트 필수 버전',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  version_required: string;

  @ApiProperty({
    example: '버그 수정으로 인한 버전 업데이트',
    description: '버전 변경내역',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  version_detail: string;

  @ApiProperty({
    example: 1,
    description: '해당 버전 사용 유무',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  version_enabled: number;
}
