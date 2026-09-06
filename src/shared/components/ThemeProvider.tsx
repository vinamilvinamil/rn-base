import { useColorScheme as useColorNativeWindScheme } from 'nativewind';
import React, { Context, createContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
    theme: ThemeMode;
    colorScheme: 'light' | 'dark';
    setTheme: (theme: ThemeMode) => void;
}

export const ThemeContext: Context<ThemeContextValue | null> = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const systemColorScheme = useColorScheme();
    const nativeWindColorSheme = useColorNativeWindScheme()
    const [theme, setTheme] = useState<ThemeMode>('system');

    const colorScheme =
        theme === 'system'
            ? systemColorScheme === 'unspecified' ? 'light' : systemColorScheme
            : theme;
    
    const setThemeValue = (value : ThemeMode) => {
        setTheme(value);
        nativeWindColorSheme.setColorScheme(value);
    }

    const value = useMemo(
        () => ({
            theme,
            colorScheme,
            setTheme: setThemeValue,
        }),
        [theme, colorScheme],
    );

    return (
        <ThemeContext.Provider value={value} >
            {children}
        </ThemeContext.Provider>
    );
};