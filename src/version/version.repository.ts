import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import {
  EntityManager,
  EntityRepository,
  Repository,
  Transaction,
  TransactionManager,
} from 'typeorm';
import { Version } from './version.entity';
import { VersionDto, VersionUpdateDto } from './dto/version.dto';

@EntityRepository(Version)
export class VersionRepository extends Repository<Version> {
  /**
   * @author 박현진 팀장
   * @description 신규 버전을 DB에 Insert하는 메서드
   *
   * @param versionDto  신규 버전 데이터를 담은 객체
   *
   * @returns {Promise<Version>}
   */
  @Transaction()
  async onCreate(
    versionDto: VersionDto,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Version> {
    try {
      const { version_new, version_detail } = versionDto;

      const curVersion = await manager.findOne(Version, {
        where: { version_enabled: 1 },
      });

      if (curVersion === undefined) {
        return await manager.save(Version, {
          version_new: version_new,
          version_current: '2.2.2',
          version_required: '2.2.2',
          version_detail: version_detail,
          version_enabled: 1,
        });
      } else {
        const editCurVersion = await manager.update(
          Version,
          { version_idx: curVersion.version_idx },
          { version_enabled: 0 },
        );

        if (editCurVersion.affected !== 1) {
          throw new NotFoundException('해당 버전을 찾을 수 없습니다.');
        } else {
          return await manager.save(Version, {
            version_new: version_new,
            version_current: curVersion.version_current,
            version_required: curVersion.version_current,
            version_detail: version_detail,
            version_enabled: 1,
          });
        }
      }
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
   * @description DB에서 해당하는 고유번호(IDX)를 가진 버전 정보를 조회
   *
   * @param version_idx  조회 대상 버전의 고유번호
   *
   * @returns {Promise<Version>}
   */
  async findByVersionIdx(version_idx: string): Promise<Version> {
    const version = await this.findOne({ where: { version_idx: version_idx } });

    if (!version) {
      throw new NotFoundException('해당 버전을 찾을 수 없습니다.');
    } else {
      return version;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)를 가진 버전 정보를 수정
   *
   * @param version_idx  수정 대상 버전의 고유번호
   * @param version      수정 정보를 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditVersion(
    version_idx: string,
    version: VersionUpdateDto,
  ): Promise<boolean> {
    const editResult = await this.update(
      { version_idx },
      {
        version_new: version.version_new,
        version_current: version.version_current,
        version_required: version.version_required,
        version_detail: version.version_detail,
        version_enabled: version.version_enabled,
      },
    );

    if (editResult.affected !== 1) {
      throw new NotFoundException('해당 버전이 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)를 가진 버전 정보의 사용유무 필드를 '사용'으로 수정
   *
   * @param version_idx  조회 대상 버전의 고유번호
   *
   * @returns {Promise<boolean>} true / false
   */
  @Transaction()
  async onEditVersionEnabled(
    version_idx: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<boolean> {
    const curVersion = await manager.findOne(Version, {
      where: { version_enabled: 1 },
    });

    if (curVersion === undefined) {
      throw new NotFoundException('현재 입력된 버전이 존재하지 않습니다.');
    } else if (
      curVersion.version_idx === version_idx &&
      curVersion.version_enabled === 1
    ) {
      return true;
    } else {
      const editCurVersion = await manager.update(
        Version,
        { version_idx: curVersion.version_idx },
        { version_enabled: 0 },
      );

      if (editCurVersion) {
        const editResult = await manager.update(
          Version,
          { version_idx },
          { version_enabled: 1 },
        );

        if (editResult.affected !== 1) {
          throw new NotFoundException('해당 버전이 존재하지 않습니다.');
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)를 가진 버전 정보를 삭제
   *
   * @param version_idx  삭제 대상 버전의 고유번호
   *
   * @returns {Promise<boolean>}
   */
  @Transaction()
  async onDeleteVersion(
    version_idx: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<boolean> {
    const version = await manager.findOne(Version, {
      where: { version_idx: version_idx },
    });

    if (version.version_enabled === 1) {
      return false;
    } else {
      const deleteVersion = await manager.delete(Version, version_idx);

      if (deleteVersion.affected === 0) {
        throw new NotFoundException('해당하는 버전이 존재하지 않습니다.');
      } else {
        return true;
      }
    }
  }
}
