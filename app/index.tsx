import { Redirect } from 'expo-router';

import { useAppSelector } from '@/store/hooks';

export default function Index() {
  const status = useAppSelector(
    state => state.auth.status,
  );

  if (status === 'unknown') {
    return null;
  }

  if (status === 'authenticated') {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}