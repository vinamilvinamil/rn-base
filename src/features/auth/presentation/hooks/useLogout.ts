import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { useAppDispatch } from '@/store/hooks';
import { setUnauthenticated } from '@/store/slices/authSlice';
import { authRepository } from '../../data/repositories/AuthRepositoryImpl';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  
  return useMutation({
    mutationFn: () => authRepository.logout(),

    onSuccess: () => {
      dispatch(setUnauthenticated());
      router.replace('/login');
    },
  });
};