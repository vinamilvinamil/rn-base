// app/(main)/products/[id]/edit.tsx

import { ProductEditScreen } from '@/features/products/presentation/screens/ProductEditScreen';
import { useLocalSearchParams } from 'expo-router';

export default function ProductEditRoute() {
  const {id} = useLocalSearchParams<{id: string}>();

  return <ProductEditScreen productId={id}/>;
}