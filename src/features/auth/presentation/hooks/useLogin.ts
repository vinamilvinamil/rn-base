import { useMutation } from '@tanstack/react-query';

import { useAppDispatch } from '@/store/hooks';
import {
    setAuthenticated,
} from '@/store/slices/authSlice';
import { authRepository } from '../../data/repositories/AuthRepositoryImpl';
import { LoginInput } from '../../domain/repositories/AuthRepository';


export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (loginInput: LoginInput) => authRepository.login(loginInput),

    onSuccess: result => {
      dispatch(
        setAuthenticated({
          accessToken:
            result.accessToken,

          user: result.user,
        }),
      );
    },
  });
};