import { useTranslation } from 'react-i18next';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useLogout } from '@/features/auth/presentation/hooks/useLogout';
import { Button } from '@/shared/components/Button';
import { useAppSelector } from '@/store/hooks';
import { ProfileHeader } from '../components/ProfileHeader';

import i18n from '@/infrastructure/i18n';
import { BottomSheet, BottomSheetRef } from '@/shared/components/BottomSheet';
import { BaseHeader } from '@/shared/components/Header';
import { useColorTheme } from '@/shared/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
type Language = 'vi' | 'en';
type ThemeMode = 'light' | 'dark' | 'system';
interface SettingOption<T> { label: string; value: T; }
const LANGUAGE_OPTIONS: SettingOption<Language>[] = [
    { label: 'Tiếng Việt', value: 'vi', },
    { label: 'English', value: 'en', },
]; const THEME_OPTIONS: SettingOption<ThemeMode>[] = [
    { label: 'Sáng', value: 'light', },
    { label: 'Tối', value: 'dark', },
    { label: 'Theo hệ thống', value: 'system', },
];

const ProfileScreen = () => {
    const { t, } = useTranslation();
    const user = useAppSelector(
        state => state.auth.user,
    );
    const { theme: currentTheme, setTheme } = useColorTheme()
    const logout = useLogout();

    const languageSheetRef = useRef<BottomSheetRef>(null);
    const themeSheetRef = useRef<BottomSheetRef>(null);

    // TODO: replace with your actual hooks 
    const language: Language = i18n.language as Language;
    const theme: ThemeMode = currentTheme;
    const handleLanguagePress = () => {
        languageSheetRef.current?.present();
    };
    const handleThemePress = () => {
        themeSheetRef.current?.present();
    };
    const handleLanguageSelect = async (value: Language) => {
        await i18n.changeLanguage(value);
        languageSheetRef.current?.dismiss();
    };
    const handleThemeSelect = (value: ThemeMode) => {
        setTheme(value);
        themeSheetRef.current?.dismiss();
    };

    const handleLogout = () => {
        logout.mutate();
    };

    if (!user) {
        return null;
    }

    const currentLanguageLabel = t(`profile.languages.${language}`);
    const currentThemeLabel = t(`profile.themes.${theme}`);

    return (
        <>
            <View className='flex-1 bg-background p-6'>
                <BaseHeader/>
                <ProfileHeader user={user} />

                <View style={styles.info}>
                    <View style={styles.row}>
                        <Text className='text-sm text-text-secondary'>
                            {t('profile.email')}
                        </Text>

                        <Text className='text-base font-medium text-text'>
                            {user.email}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text className='text-sm text-text-secondary'>
                            {t('profile.name')}
                        </Text>

                        <Text className='text-base font-medium text-text'>
                            {user.name}
                        </Text>
                    </View>
                </View>

                {/* Settings */}
                <View className="mt-8">
                    <Text className="mb-3 text-sm font-semibold text-text-secondary">
                        {t('profile.settings')}
                    </Text>
                    <View className="overflow-hidden rounded-xl border border-border bg-background">
                        {/* Language */}
                        <Pressable
                            onPress={handleLanguagePress}
                            className="flex-row items-center justify-between px-4 py-4 active:bg-background-element">
                            <View className="flex-1 flex-row items-center">
                                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-background-element">
                                    <Ionicons name="language-outline" size={20} color="currentColor" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-medium text-text"> {t('profile.language')} </Text>
                                    <Text className="mt-1 text-sm text-text-secondary"> {currentLanguageLabel} </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                        </Pressable>
                        <View className="h-px bg-border" />
                        {/* Theme */}
                        <Pressable
                            onPress={handleThemePress}
                            className="flex-row items-center justify-between px-4 py-4 active:bg-background-element">
                            <View className="flex-1 flex-row items-center">
                                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-background-element">
                                    <Ionicons name="color-palette-outline"
                                        size={20}
                                        color="#94A3B8" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-medium text-text"> {t('profile.theme')} </Text>
                                    <Text className="mt-1 text-sm text-text-secondary"> {currentThemeLabel} </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.logoutContainer}>
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        fullWidth
                        loading={logout.isPending}
                        disabled={logout.isPending}
                    />
                </View>
            </View>
            {/* Language Bottom Sheet */}
            <BottomSheet
                ref={languageSheetRef}
                title={t('profile.language')}>
                <View className="pb-6">
                    {LANGUAGE_OPTIONS.map(option => {
                        const selected = option.value === language;

                        return (
                            <Pressable
                                key={option.value}
                                onPress={() =>
                                    handleLanguageSelect(option.value)
                                }
                                className="flex-row items-center justify-between px-4 py-4 active:bg-background-element">
                                <Text className="text-base text-black">
                                    {t(
                                        `profile.languages.${option.value}`,
                                    )}
                                </Text>

                                {selected && (
                                    <Ionicons
                                        name="checkmark"
                                        size={22}
                                        color="#2563EB"
                                    />
                                )}
                            </Pressable>
                        );
                    })}
                </View>
            </BottomSheet>

            {/* Theme Bottom Sheet */}
            <BottomSheet
                ref={themeSheetRef}
                title={t('profile.theme')}>
                <View className="pb-6">
                    {THEME_OPTIONS.map(option => {
                        const selected = option.value === theme;

                        return (
                            <Pressable
                                key={option.value}
                                onPress={() =>
                                    handleThemeSelect(option.value)
                                }
                                className="flex-row items-center justify-between px-4 py-4 active:bg-background-element">
                                <Text className="text-base text-black">
                                    {t(`profile.themes.${option.value}`)}
                                </Text>

                                {selected && (
                                    <Ionicons
                                        name="checkmark"
                                        size={22}
                                        color="#2563EB"
                                    />
                                )}
                            </Pressable>
                        );
                    })}
                </View>
            </BottomSheet>
        </>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },

    info: {
        marginTop: 32,
        gap: 20,
    },

    row: {
        gap: 6,
    },

    label: {
        fontSize: 13,
        color: '#6B7280',
    },

    value: {
        fontSize: 16,
    },

    logoutContainer: {
        marginTop: 40,
    },
});