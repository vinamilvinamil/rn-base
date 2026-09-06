import {
    AuthRepository,
    AuthSession,
    LoginInput,
} from '../../domain/repositories/AuthRepository';

import { MOCK_ENABLE } from '@/shared/constants/Constants';
import axios from 'axios';
import { secureStorage } from '../../../../infrastructure/storage';
import { AuthError } from '../../domain/errors/AuthError';
import { authApi } from '../api/authApi';
import { AuthMapper } from '../mappers/AuthMapper';
import { MockAuthRepositoryImpl } from './MockAuthRepositoryImpl';

export class AuthRepositoryImpl
    implements AuthRepository {
    async login(
        input: LoginInput,
    ): Promise<AuthSession> {
        try {
            const response =
                await authApi.login(input);

            const result =
                AuthMapper.loginResponse(response);

            await secureStorage.saveRefreshToken(
                result.refreshToken,
            );

            return {
                accessToken: result.accessToken,
                user: result.user,
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new AuthError('INVALID_CREDENTIALS');
                }
            }
            throw error;

        }
    }

    async refreshSession(): Promise<AuthSession> {
        const refreshToken =
            await secureStorage.getRefreshToken();

        if (!refreshToken) {
            throw new Error(
                'Refresh token not found',
            );
        }

        const response =
            await authApi.refresh(
                refreshToken,
            );

        const result =
            AuthMapper.refreshResponse(response);

        return result;
    }

    async logout(): Promise<void> {
        try {
            await authApi.logout();
        } finally {
            await secureStorage.clearRefreshToken();
        }
    }

    async getCurrentUser() {
        return authApi
            .getCurrentUser()
            .then(AuthMapper.toUser);
    }
}

export const authRepository = MOCK_ENABLE ? new MockAuthRepositoryImpl() : new AuthRepositoryImpl();