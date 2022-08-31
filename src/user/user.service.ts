import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, StateDto, UpdateUserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { User, UserState } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Pagination, PaginationOptions } from 'src/paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  /**
   * @author 박현진 팀장
   * @description 신규 회원을 생성하는 비즈니스 로직
   *
   * @param createUserDto 신규 회원의 정보를 담은 객체
   *
   * @returns {Promise<User>} newUser 생성된 user 정보를 반환합니다.
   */
  async onCreateUser(createUserDto: CreateUserDto): Promise<User> {
    await this.transformPassword(createUserDto);
    return await this.userRepository.onCreate(createUserDto);
  }

  async checkUserId(user_id: string): Promise<any> {
    return await this.userRepository.onCheckUserId(user_id);
  }

  /**
   * @author 박현진 팀장
   * @description 유저의 권한을 변경하는 서비스 비즈니스 로직입니다.
   *
   * @param user_idx 권한 변경 대상 유저의 고유 번호
   *
   * @returns 상태 변경 성공 여부를 boolean 값으로 리턴함
   */
  async editUserRole(user_idx: string): Promise<any> {
    return await this.userRepository.onEditUserRole(user_idx);
  }

  /**
   * @author 박현진 팀장
   * @description 유저의 상태를 변경하는 서비스 비즈니스 로직입니다.
   *
   * @param state 회원 정보와 상태 변경 값을 담은 객체
   *
   * @returns 상태 변경 성공 여부를 boolean 값으로 리턴함
   */
  async editUserState(state: StateDto): Promise<any> {
    // 정해진 상태에 포함되있지 않은 상태값이 넘어올 경우 '1025' 에러코드와 함께 상태 변경 실패함 !!
    if (
      Object.keys(UserState).find(key => UserState[key] === state.user_state)
    ) {
      return await this.userRepository.onEditUserState(state);
    } else {
      return false;
    }
  }

  /**
   * @author 박현진 팀장
   * @description 회원 목록을 조회하는 API
   *
   * @param options  페이징을 위한 옵션값을 담은 객체
   *
   * @returns {User[]} users 조회된 회원 목록을 리턴함
   */
  async getUserAll(
    options: PaginationOptions,
    type: string,
  ): Promise<Pagination<User>> {
    const { take, page } = options;
    const [results, total] = await this.userRepository.findAndCount({
      select: [
        'user_idx',
        'user_id',
        'user_nickname',
        'user_email',
        'user_create_date',
      ],
      where: { user_state: type },
      take: take,
      skip: take * (page - 1),
      order: { user_create_date: 'DESC' },
    });

    return new Pagination<User>({
      results,
      total,
    });
  }

  /**
   * @author 박현진 팀장
   * @description 회원 ID를 통해 단일 회원을 조회하는 API
   *
   * @param user_id  회원 아이디
   *
   * @returns {User} user 조회된 회원의 상세 정보를 리턴함
   */
  async findByUserOne(user_id: string): Promise<User> {
    return await this.userRepository.findByUserId(user_id);
  }

  /**
   * @author 박현진 팀장
   * @description 회원 고유번호(IDX)를 통해 단일 회원을 조회하는 API
   *
   * @param user_idx  회원 고유번호
   *
   * @returns {User}  user 조회된 회원의 상세 정보를 리턴함
   */
  async readByUserOne(user_idx: string): Promise<User> {
    return await this.userRepository.findByUserIdx(user_idx);
  }

  /**
   * @author 박현진 팀장
   * @description 회원 고유번호(IDX)를 통해 단일 회원의 닉네임 정보를 수정하는 API
   *
   * @param user_idx    회원 고유 번호
   * @param updateDto   회원 수정 데이터
   *
   * @returns {Promise<boolean>} true/false
   */
  async updateUser(
    user_idx: string,
    updateDto: UpdateUserDto,
  ): Promise<boolean> {
    if (updateDto.user_password !== ' ') {
      if (
        updateDto.user_password.length < 8 ||
        updateDto.user_password.length > 16
      ) {
        throw new ForbiddenException('비밀번호를 양식에 맞게 작성해주세요.');
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(
          updateDto.user_password,
        )
      ) {
        throw new ForbiddenException('비밀번호를 양식에 맞게 작성해주세요.');
      } else {
        await this.transformPassword(updateDto);
      }
    } else if (updateDto.user_email !== ' ') {
      if (
        updateDto.user_email.length < 10 ||
        updateDto.user_email.length > 100
      ) {
        throw new ForbiddenException('이메일을 양식에 맞게 작성해주세요.');
      } else if (
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$/.test(
          updateDto.user_email,
        )
      ) {
        throw new ForbiddenException('이메일을 양식에 맞게 작성해주세요.');
      }
    }

    return await this.userRepository.onEditUser(user_idx, updateDto);
  }

  /**
   * @author 박현진 팀장
   * @description 회원 고유번호(IDX)를 통해 단일 회원의 이메일 인증 여부 정보를 수정하는 API
   *
   * @param user_idx       회원 고유 번호
   * @param user_nickname  회원 수정 데이터
   *
   * @returns {Promise<boolean>} true/false
   */
  async updateUserEmailYn(user_idx: string): Promise<boolean> {
    return await this.userRepository.onEditUserEmailYn(user_idx);
  }

  /**
   * @author 박현진 팀장
   * @description 탈퇴 회원 상태 및 사용유무 변경
   *
   * @param updateUserDto 유저 정보
   *
   * @returns {Promise<boolean>} true/false
   */
  async updateUserStateAndEnabled(user_idx: string): Promise<any> {
    return await this.userRepository.onEditUserStateAndEnabled(user_idx);
  }

  /**
   * @author 박현진 팀장
   * @description 대상 회원의 데이터를 삭제합니다.
   *
   * @param user_idx 대상 회원의 고유 번호
   *
   * @returns {Promise<boolean>} true / false
   */
  async deleteUser(user_idx: string): Promise<boolean> {
    return await this.userRepository.onDelete(user_idx);
  }

  /**
   * @author 박현진 팀장
   * @description 회원 비밀번호에 bcrypt 암호화를 적용합니다.
   *
   * @param user  신규 생성 회원의 데이터를 담은 객체
   *
   * @returns {Promise<void>} resolve
   */
  async transformPassword(user: any): Promise<void> {
    user.user_password = await bcrypt.hash(user.user_password, 10);
    return Promise.resolve();
  }

  /**
   * @author 박현진 팀장
   * @description 해당 회원이 현재 새롭게 발급받은 Refresh Token을 본인 정보에 업데이트 합니다.
   *
   * @param refreshToken  신규 발급받은 Refresh Token 문자열
   * @param user_idx      해당 회원의 고유 번호
   *
   * @returns {Promise<boolean>} true / false
   */
  async setCurrentRefreshToken(
    refresh_token: string,
    user_idx: string,
  ): Promise<boolean> {
    const currentHashedRefreshToken = await await bcrypt.hash(
      refresh_token,
      12,
    );
    return await this.userRepository.onEditUserRefreshToken(
      user_idx,
      currentHashedRefreshToken,
    );
  }

  /**
   * @author 박현진 팀장
   * @description 현재 로그인한 회원의 IP Address와 Device 정보를 업데이트 합니다.
   *
   * @param ip_address    로그인한 회원의 IP Address
   * @param user_agent    로그인한 회원의 User Agent
   * @param user_idx      로그인한 회원의 고유 번호
   *
   * @returns {User} user
   */
  async setUserLastLoginData(
    ip_address: string,
    user_agent: string,
    user_idx: string,
  ): Promise<User> {
    return await this.userRepository.onEditLoginIpAndDevice(
      ip_address,
      user_agent,
      user_idx,
    );
  }

  /**
   * @author 박현진 팀장
   * @description 회원이 클라이언트에서 보유한 Refresh Token과 현재 서버상에 보유중인 Refresh Token이 일치하는지 비교하는 메서드
   *
   * @param refreshToken  회원이 가진 Refresh Token 문자열
   * @param user_idx      해당 회원의 고유 번호
   *
   * @returns {User} user
   */
  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    user_idx: string,
  ): Promise<any> {
    const user = await this.userRepository.findByUserIdx(user_idx);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.current_hashed_refresh_token as string,
    );

    if (isRefreshTokenMatching) {
      return {
        user_idx: user.user_idx,
        user_id: user.user_id,
        user_nickname: user.user_nickname,
        user_email: user.user_email,
        user_role: user.user_role,
        login_date: user.user_last_login_date,
        login_device: user.user_last_login_device,
        login_ip: user.user_last_login_ip,
      };
    } else {
      throw new ForbiddenException('회원 정보를 다시 확인해주세요.');
    }
  }

  /**
   * @author 박현진 팀장
   * @description 회원이 로그아웃하여 DB에 있는 Refresh Token을 사용하지 않게되어 삭제하는 메서드
   *
   * @param user_idx      해당 회원의 고유 번호
   *
   * @returns {boolean} true / false
   */
  async removeRefreshToken(user_idx: string) {
    return await this.userRepository.onRemoveUserRefreshToken(user_idx);
  }
}
