import axios, {
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios';

import { store } from '@/store';
import {
    setAuthenticated,
    setUnauthenticated,
} from '@/store/slices/authSlice';

import { secureStorage } from '../storage';
import { toastService } from '../toast/toastService';

const API_BASE_URL = 'https://your-api.com';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const accessToken = store.getState().auth.accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
);

let isRefreshing = false;

type FailedRequest = {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (
    error: unknown,
    token: string | null,
) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else if (token) {
            resolve(token);
        }
    });

    failedQueue = [];
};

apiClient.interceptors.response.use(
    response => response,

    async (error: AxiosError) => {
        if (!error.response) {
            toastService.error('errors.network');

            return Promise.reject(error);
        }

        if (error.response.status >= 500) {
            toastService.error('errors.server');

            return Promise.reject(error);
        }

        const originalRequest = error.config as
            | (InternalAxiosRequestConfig & { _retry?: boolean })
            | undefined;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                failedQueue.push({
                    resolve,
                    reject,
                });
            }).then(token => {
                originalRequest.headers.Authorization =
                    `Bearer ${token}`;

                return apiClient(originalRequest);
            });
        }

        isRefreshing = true;

        try {
            const refreshToken =
                await secureStorage.getRefreshToken();

            if (!refreshToken) {
                throw new Error('Refresh token not found');
            }

            /**
             * IMPORTANT:
             * Không dùng apiClient ở đây,
             * nếu không interceptor có thể tự intercept refresh request.
             */
            const response = await axios.post(
                `${API_BASE_URL}/auth/refresh`,
                {
                    refresh_token: refreshToken,
                },
            );

            const {
                access_token,
                user,
            } = response.data;

            store.dispatch(
                setAuthenticated({
                    accessToken: access_token,
                    user,
                }),
            );

            processQueue(null, access_token);

            originalRequest.headers.Authorization =
                `Bearer ${access_token}`;

            return apiClient(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);

            await secureStorage.clearRefreshToken();

            store.dispatch(setUnauthenticated());

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);