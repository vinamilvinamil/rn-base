import { useColorScheme } from 'nativewind';
import { useContext } from "react";
import { ThemeContext } from "../components/ThemeProvider";
import { Colors } from "../constants/theme";

export const useColorTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            'useColorTheme must be used inside ThemeProvider',
        );
    }

    return context;
};

export const useColors = () => {
    const {colorScheme} = useColorScheme();
    return colorScheme == 'light' ? Colors.light : Colors.dark; 
}