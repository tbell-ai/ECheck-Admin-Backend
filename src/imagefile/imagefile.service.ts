import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageFileRepository } from './imagefile.repository';

@Injectable()
export class ImagefileService {
  constructor(
    @InjectRepository(ImageFileRepository)
    private imagefileRepository: ImageFileRepository,
  ) {}

  /**
   * @author 박현진 팀장
   * @description 신규 이미지 파일정보를 생성하는 비즈니스 로직
   *
   * @param imagefileDto 신규 이미지 파일정보를 담은 객체
   *
   * @returns {Promise<ImageFile>} 생성된 image 파일 정보를 반환합니다.
   */
  async onCreateCampaignImageFile(
    files: Array<Express.Multer.File>,
    entity: any,
  ): Promise<number> {
    return await (
      await this.imagefileRepository.onCreateCampaignImageFile(files, entity)
    ).length;
  }
}
