import { apiClient } from '@/infrastructure/api';

import {
    LoginRequestDto,
    LoginResponseDto,
    RefreshResponseDto,
} from '../dto/AuthDto';

export const authApi = {
    login: async (
        data: LoginRequestDto,
    ): Promise<LoginResponseDto> => {
        const response =
            await apiClient.post<LoginResponseDto>(
                '/auth/login',
                data,
            );

        return response.data;
    },

    refresh: async (
        refreshToken: string,
    ): Promise<RefreshResponseDto> => {
        const response =
            await apiClient.post<RefreshResponseDto>(
                '/auth/refresh',
                {
                    refresh_token: refreshToken,
                },
            );

        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },
    getCurrentUser: async () : Promise<LoginResponseDto['user']> => {
        const response =
            await apiClient.get(
                '/auth/me',
            );

        return response.data;
    }
};