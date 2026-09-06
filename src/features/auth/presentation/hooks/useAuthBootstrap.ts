import { useAppDispatch } from '@/store/hooks';
import {
  setAuthenticated,
  setUnauthenticated,
} from '@/store/slices/authSlice';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { authRepository } from '../../data/repositories/AuthRepositoryImpl';

export const useAuthBootstrap = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const session =
          await authRepository.refreshSession();

        if (!mounted) {
          return;
        }

        dispatch(
          setAuthenticated({
            accessToken:
              session.accessToken,
            user: session.user,
          }),
        );
      } catch {
        if (!mounted) {
          return;
        }

        dispatch(
          setUnauthenticated(),
        );
      } finally {
        if (mounted) {
          await SplashScreen.hideAsync();
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [dispatch]);
};