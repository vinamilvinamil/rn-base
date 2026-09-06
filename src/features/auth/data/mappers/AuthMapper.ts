import { User } from '../../domain/entities/User';
import {
    LoginResponseDto,
    RefreshResponseDto,
} from '../dto/AuthDto';

export const AuthMapper = {
  toUser(
    data: LoginResponseDto['user'],
  ): User {
    return {
      id: String(data.id),
      email: data.email,
      name: data.full_name,
    };
  },

  loginResponse(
    data: LoginResponseDto,
  ) {
    return {
      accessToken: data.access_token,

      refreshToken: data.refresh_token,

      user: AuthMapper.toUser(data.user),
    };
  },

  refreshResponse(
    data: RefreshResponseDto,
  ) {
    return {
      accessToken: data.access_token,

      user: AuthMapper.toUser(data.user),
    };
  },
};