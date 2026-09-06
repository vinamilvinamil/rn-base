import { Redirect, Stack } from 'expo-router';

import { useAppSelector } from '@/store/hooks';
import { useTranslation } from 'react-i18next';

export default function MainLayout() {
  const {t} = useTranslation();
  const status = useAppSelector(
    state => state.auth.status,
  );

  if (status === 'unknown') {
    return null;
  }

  if (status === 'unauthenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
    </Stack>
  );
}