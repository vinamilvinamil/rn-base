import type { PropsWithChildren } from 'react'; import { View, StyleSheet, type ViewStyle } from 'react-native'; import { colors } from '@/src/shared/theme/colors'; import { cardShadow } from '@/src/shared/theme/shadows';
export function AppCard({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) { return <View style={[styles.card, cardShadow, style]}>{children}</View>; }
const styles = StyleSheet.create({ card: { backgroundColor: colors.surface, borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#EDF2F0', gap: 10 } });
