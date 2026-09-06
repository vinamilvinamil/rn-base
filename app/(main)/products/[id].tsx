// app/(main)/products/[id].tsx

import { useLocalSearchParams } from 'expo-router';

export default function ProductDetailRoute() {
  const {id} = useLocalSearchParams<{id: string}>();

  return null;
}