import type { PropsWithChildren } from 'react';
import { Text, type TextProps, StyleSheet } from 'react-native';
import { colors } from '@/src/shared/theme/colors';
type Variant = 'title' | 'heading' | 'body' | 'caption';
export function AppText({ children, variant = 'body', style, ...props }: PropsWithChildren<TextProps & { variant?: Variant }>) {
  return <Text {...props} style={[styles.base, styles[variant], style]}>{children}</Text>;
}
const styles = StyleSheet.create({ base: { color: colors.text }, title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }, heading: { fontSize: 18, fontWeight: '700' }, body: { fontSize: 14, lineHeight: 21 }, caption: { fontSize: 12, color: colors.muted } });
