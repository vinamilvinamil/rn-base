/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#2563EB',
    primaryPressed: '#1D4ED8',
    primarySoft: '#EFF6FF',

    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#E2E8F0',

    text: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textDisabled: '#CBD5E1',

    border: '#E2E8F0',
    borderStrong: '#CBD5E1',

    success: '#16A34A',
    successSoft: '#F0FDF4',

    warning: '#D97706',
    warningSoft: '#FFFBEB',

    error: '#DC2626',
    errorSoft: '#FEF2F2',

    info: '#2563EB',
    infoSoft: '#EFF6FF',
  },

  dark: {
    primary: '#60A5FA',
    primaryPressed: '#3B82F6',
    primarySoft: '#172554',

    background: '#09090B',
    backgroundSecondary: '#18181B',
    backgroundElement: '#27272A',
    backgroundSelected: '#3F3F46',

    text: '#FAFAFA',
    textSecondary: '#A1A1AA',
    textTertiary: '#71717A',
    textDisabled: '#52525B',

    border: '#27272A',
    borderStrong: '#3F3F46',

    success: '#4ADE80',
    successSoft: '#052E16',

    warning: '#FBBF24',
    warningSoft: '#451A03',

    error: '#F87171',
    errorSoft: '#450A0A',

    info: '#60A5FA',
    infoSoft: '#172554',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
