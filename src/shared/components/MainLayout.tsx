import { Redirect, Stack } from 'expo-router';

import { useAppSelector } from '@/store/hooks';

export default function MainLayout() {
  const status = useAppSelector(
    state => state.auth.status,
  );

  if (status === 'unknown') {
    return null;
  }

  if (status === 'unauthenticated') {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    />
  );
}