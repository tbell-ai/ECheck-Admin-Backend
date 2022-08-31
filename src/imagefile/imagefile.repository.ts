import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Campaign } from 'src/campaign/campaign.entity';
import { EntityRepository, Repository } from 'typeorm';
import { ImageFile } from './imagefile.entity';

@EntityRepository(ImageFile)
export class ImageFileRepository extends Repository<ImageFile> {
  /**
   * @author 박현진 팀장
   * @description 신규 이미지 파일 정보를 DB에 Insert하는 메서드
   *
   * @param imageFileDto  신규 이미지 파일정보 데이터를 담은 객체
   *
   * @returns {Promise<ImageFile>}
   */
  async onCreateCampaignImageFile(
    files: Array<Express.Multer.File>,
    campaign: Campaign,
  ): Promise<ImageFile[]> {
    try {
      const uploadArr = [];

      for (const file of files) {
        const { originalname, filename, mimetype, path, size } = file;

        const upload = await this.save({
          imagefile_origin_filename: originalname,
          imagefile_save_filename: filename,
          imagefile_extension: mimetype,
          imagefile_path: path,
          imagefile_size: size,
          campaign: campaign,
        });

        uploadArr.push(upload);
      }

      return uploadArr;
    } catch (error) {
      throw new HttpException(
        {
          error: error,
          message: '오류가 발생하였습니다. 잠시후 다시 시도해주세요.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)에 속하는 파일 정보를 조회
   *
   * @param campaign_idx  조회 대상 파일 정보가 속하는 고유번호
   *
   * @returns {Promise<Discount>}
   */
  async findByCampaignIdx(campaign_idx: string): Promise<ImageFile[]> {
    const imageFiles = await this.find({
      select: [
        'imagefile_idx',
        'imagefile_origin_filename',
        'imagefile_save_filename',
        'imagefile_extension',
        'imagefile_path',
      ],
      where: {
        campaign: { campaign_idx: campaign_idx },
      },
    });

    return imageFiles;
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)를 가진 파일 정보를 삭제
   *
   * @param imagefile_idx  삭제 대상 파일 정보의 고유번호
   *
   * @returns {Promise<string>} DB에서 삭제된 이미지 파일의 경로를 반환한다.
   */
  async onDeleteImageFile(imagefile_idx: string): Promise<string> {
    const imageFile = await this.findOne(imagefile_idx);
    const deleteImage = await this.delete(imagefile_idx);

    if (deleteImage.affected === 0) {
      throw new NotFoundException('해당하는 파일 정보가 존재하지 않습니다.');
    } else {
      return imageFile.imagefile_path;
    }
  }
}
