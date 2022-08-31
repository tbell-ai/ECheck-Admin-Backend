import {
  HttpException,
  HttpStatus,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, StateDto, UpdateUserDto } from './dto/user.dto';
import { EntityRepository, Repository } from 'typeorm';
import { User, UserState } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * @author 박현진 팀장
   * @description 신규 회원을 DB에 Insert하는 메서드
   *
   * @param createUserDto  신규 회원 데이터를 담은 객체
   *
   * @returns {Promise<User>}
   */
  async onCreate(createUserDto: CreateUserDto): Promise<User> {
    try {
      const {
        user_id,
        user_password,
        user_nickname,
        user_email,
        user_email_yn,
        user_term_yn,
        user_collection_yn,
        user_privacy_yn,
      } = createUserDto;

      return await this.save({
        user_id,
        user_password,
        user_nickname,
        user_email,
        user_email_yn,
        user_term_yn,
        user_collection_yn,
        user_privacy_yn,
      });
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
   * @description DB에서 해당하는 회원의 권한을 변경하는 메서드
   *
   * @param user_idx  변경대상 회원의 고유 번호
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditUserRole(user_idx: string): Promise<boolean> {
    const chnageUser = await this.update({ user_idx }, { user_role: 'admin' });

    if (chnageUser.affected !== 1) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 회원을 정해진 상태로 변경하는 메서드
   *
   * @param state  변경대상 회원의 정보와 변경값을 담은 객체
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditUserState(state: StateDto): Promise<boolean> {
    const { user_idx, user_state } = state;

    const chnageUser = await this.update({ user_idx }, { user_state });

    if (chnageUser.affected !== 1) {
      throw new NotFoundException('존재하지 않는 회원입니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 회원 아이디(ID)가 존재하는지 확인
   *
   * @param user_id  조회 대상 회원 아이디
   *
   * @returns {Promise<boolean>} true / false
   */
  async onCheckUserId(user_id: string): Promise<boolean> {
    const user = await this.findOne({ where: { user_id: user_id } });

    if (!user) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 회원 아이디(ID)를 가진 회원 정보를 조회
   *
   * @param user_id  조회 대상 회원의 아이디
   *
   * @returns {Promise<User>} user
   */
  async findByUserId(user_id: string): Promise<User> {
    const user = await this.findOne({ where: { user_id: user_id } });

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    } else {
      return user;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 해당하는 고유번호(IDX)를 가진 회원 정보를 조회
   *
   * @param user_idx  조회 대상 회원의 고유번호
   *
   * @returns {Promise<User>} user
   */
  async findByUserIdx(user_idx: string): Promise<User> {
    const user = await this.findOne({ where: { user_idx: user_idx } });

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    } else {
      return user;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 로그인을 요청 회원의 존재유무를 확인하는 메서드
   *
   * @param user_id       로그인한 회원의 아이디
   * @param user_password 로그인한 회원의 비밀번호
   *
   * @returns {Promise<boolean>} true / false
   */
  async findByLogin(user_id: string, password: string): Promise<User> {
    const user = await this.findOne({ where: { user_id, password } });

    if (!user) {
      throw new ForbiddenException('아이디와 비밀번호를 다시 확인해주세요.');
    } else {
      return user;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 회원의 닉네임 여부를 수정하는 메서드
   *
   * @param user_idx   수정 대상 회원의 고유 번호
   * @param updateDto  수정 대상 회원의 수정 닉네임
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditUser(
    user_idx: string,
    updateDto: UpdateUserDto,
  ): Promise<boolean> {
    const user = await this.findByUserIdx(user_idx);

    const editUser = await this.update(
      { user_idx },
      {
        user_nickname:
          updateDto.user_nickname === ' '
            ? user.user_nickname
            : updateDto.user_nickname,
        user_password:
          updateDto.user_password === ' '
            ? user.user_password
            : updateDto.user_password,
        user_email:
          updateDto.user_email === ' ' ? user.user_email : updateDto.user_email,
      },
    );

    if (editUser.affected !== 1) {
      throw new NotFoundException('해당하는 회원이 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 회원의 이메일 인증 여부를 수정하는 메서드
   *
   * @param user_idx 수정 대상 회원의 고유 번호
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditUserEmailYn(user_idx: string): Promise<boolean> {
    const editUser = await this.update({ user_idx }, { user_email_yn: 1 });

    if (editUser.affected !== 1) {
      throw new NotFoundException('해당하는 회원이 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 탈퇴를 신청한 회원의 상태와 사용유무 필드를 수정하는 메서드
   *
   * @param user_idx 탈퇴 대상 회원의 고유 번호
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditUserStateAndEnabled(user_idx: string): Promise<boolean> {
    const editUser = await this.update(
      { user_idx },
      { user_state: UserState.DELETE, user_enabled: 0 },
    );

    if (editUser.affected !== 1) {
      throw new NotFoundException('해당하는 회원이 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description DB에서 회원 정보를 완전 삭제하는 메서드
   *
   * @param user_idx 삭제 대상 회원의 고유 번호
   *
   * @returns {Promise<boolean>} true / false
   */
  async onDelete(user_idx: string): Promise<boolean> {
    const deleteUser = await this.delete(user_idx);

    if (deleteUser.affected === 0) {
      throw new NotFoundException('해당하는 회원이 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 현재 로그인한 회원의 Refresh Token을 업데이트하는 메서드
   *
   * @param user_idx      대상 회원의 고유 번호
   * @param refresh_token 대상 회원의 현재 Refresh Token
   *
   * @returns {Promise<boolean>} true / false
   */
  async onEditUserRefreshToken(
    user_idx: string,
    refresh_token: string,
  ): Promise<boolean> {
    const editUser = await this.update(
      { user_idx },
      { current_hashed_refresh_token: refresh_token },
    );

    if (editUser.affected !== 1) {
      throw new NotFoundException('해당하는 회원이 존재하지 않습니다.');
    } else {
      return true;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 현재 로그인한 회원의 Ip Adress와 Device 정보를 업데이트하는 메서드
   *
   * @param ip_address  로그인한 회원의 IP Adress
   * @param user_agent  로그인한 회원의 User-Agent
   * @param user_idx    대상 회원의 고유 번호
   *
   * @returns {User} user
   */
  async onEditLoginIpAndDevice(
    ip_address: string,
    user_agent: string,
    user_idx: string,
  ): Promise<User> {
    const editUser = await this.update(
      { user_idx },
      { user_last_login_ip: ip_address, user_last_login_device: user_agent },
    );

    if (editUser.affected !== 1) {
      throw new NotFoundException('해당하는 회원이 존재하지 않습니다.');
    } else {
      return await this.findOne({ where: { user_idx: user_idx } });
    }
  }

  /**
   * @author 박현진 팀장
   * @description 현재 로그아웃한 회원의 Refresh Token 정보를 null로 변경
   *
   * @param user_idx    대상 회원의 고유 번호
   *
   * @returns {Promise<boolean>} true / false
   */
  async onRemoveUserRefreshToken(user_idx: string): Promise<boolean> {
    const editUser = await this.update(
      { user_idx },
      { current_hashed_refresh_token: null },
    );

    if (editUser.affected !== 1) {
      throw new NotFoundException('해당하는 회원이 존재하지 않습니다.');
    } else {
      return true;
    }
  }
}
