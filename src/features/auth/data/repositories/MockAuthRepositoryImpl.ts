import {
    AuthRepository,
    AuthSession,
    LoginInput,
} from '../../domain/repositories/AuthRepository';

import { secureStorage } from '../../../../infrastructure/storage';
import { AuthError } from '../../domain/errors/AuthError';
import { AuthMapper } from '../mappers/AuthMapper';
import { mockLoginResponse, mockRefreshResponse, mockUser } from '../mock/authMockData';

export class MockAuthRepositoryImpl
  implements AuthRepository
{
  async login(
    input: LoginInput,
  ): Promise<AuthSession> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (
      input.email !== 'test@gmail.com' ||
      input.password !== '123456'
    ) {
      throw new AuthError('INVALID_CREDENTIALS');
    }

    const response = mockLoginResponse;

    const result =
      AuthMapper.loginResponse(response);

    await secureStorage.saveRefreshToken(
      result.refreshToken,
    );

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  async refreshSession(): Promise<AuthSession> {
    const refreshToken =
      await secureStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error(
        'Refresh token not found',
      );
    }

    const response = mockRefreshResponse;

    const result =
      AuthMapper.refreshResponse(response);

    return result;
  }

  async logout(): Promise<void> {
    try {
      
    } finally {
      await secureStorage.clearRefreshToken();
    }
  }

  async getCurrentUser() {
    return mockUser;
  }
}

export const authRepository = new MockAuthRepositoryImpl();