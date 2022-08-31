import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, PaginationOptions } from 'src/paginate';
import { VersionDto, VersionUpdateDto } from './dto/version.dto';
import { Version } from './version.entity';
import { VersionRepository } from './version.repository';

@Injectable()
export class VersionService {
  constructor(
    @InjectRepository(VersionRepository)
    private versionRepository: VersionRepository,
  ) {}

  /**
   * @author 박현진 팀장
   * @description 신규 버전을 생성하는 비즈니스 로직
   *
   * @param versionDto 신규 버전의 정보를 담은 객체
   *
   * @returns {Promise<any>} 생성된 version 정보를 반환합니다.
   */
  async onCreateVersion(versionDto: VersionDto): Promise<any> {
    return await this.versionRepository.onCreate(versionDto);
  }

  /**
   * @author 박현진 팀장
   * @description 버전 목록을 조회하는 API
   *
   * @param options  페이징을 위한 옵션값을 담은 객체
   *
   * @returns {Version[]}
   */
  async getVersionList(
    options: PaginationOptions,
  ): Promise<Pagination<Version>> {
    const { take, page } = options;
    const [results, total] = await this.versionRepository.findAndCount({
      select: [
        'version_idx',
        'version_new',
        'version_detail',
        'version_enabled',
        'version_create_date',
      ],
      take: take,
      skip: take * (page - 1),
      order: { version_create_date: 'DESC' },
    });

    return new Pagination<Version>({
      results,
      total,
    });
  }

  /**
   * @author 박현진 팀장
   * @description 버전 고유번호(IDX)를 통해 단일 버전을 조회하는 API
   *
   * @param version_idx  버전 고유번호
   *
   * @returns {Version}  조회된 버전의 상세 정보를 리턴함
   */
  async readByOneVersion(version_idx: string): Promise<Version> {
    return await this.versionRepository.findByVersionIdx(version_idx);
  }

  /**
   * @author 박현진 팀장
   * @description 버전 고유번호(IDX)를 통해 단일 버전을 수정하는 API
   *
   * @param version_idx  버전 고유번호
   * @param version      버전 수정 정보를 담은 객체
   *
   * @returns {Promise<boolean>}  true / false
   */
  async editVersion(
    version_idx: string,
    version: VersionUpdateDto,
  ): Promise<boolean> {
    return await this.versionRepository.onEditVersion(version_idx, version);
  }

  /**
   * @author 박현진 팀장
   * @description 버전 고유번호(IDX)를 통해 단일 버전의 사용유무 필드를 수정하는 API
   *
   * @param version_idx  버전 고유번호
   *
   * @returns {Promise<boolean>}  true / false
   */
  async editVersionEnabled(version_idx: string): Promise<boolean> {
    return await this.versionRepository.onEditVersionEnabled(version_idx);
  }

  /**
   * @author 박현진 팀장
   * @description 버전 고유번호(IDX)를 통해 단일 버전을 삭제하는 API
   *
   * @param version_idx  버전 고유번호
   *
   * @returns {Promise<boolean>}  true / false
   */
  async deleteVersion(version_idx: string): Promise<boolean> {
    return await this.versionRepository.onDeleteVersion(version_idx);
  }
}
