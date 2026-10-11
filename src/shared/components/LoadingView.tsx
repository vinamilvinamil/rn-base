import { View, ActivityIndicator } from 'react-native'; import { colors } from '@/src/shared/theme/colors';
export function LoadingView() { return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color={colors.primary} /></View>; }
