import {
    ButtonProps,
    StyleProp,
    Text,
    TouchableOpacity,
    ViewStyle
} from 'react-native';

interface ChipTextProps extends ButtonProps {
    containerStyle?: StyleProp<ViewStyle>
    setValue: (_: string) => void;
    active: boolean;

}

export const ChipText = ({
    containerStyle,
    active = false,
    setValue,
    ...buttonProps
}: ChipTextProps) => {
    return (
        <TouchableOpacity
            className={`self-start px-3.5 py-1.5 rounded-full border ${active ? 'bg-brand-bg border-brand-bg' : 'bg-white border-[#E8e6DF]'}`}
            style={containerStyle}
            onPress={() => setValue(buttonProps.title)}
            {...buttonProps}>
            <Text className={`text-xs ${active ? 'text-white' : 'text-brand-text-secondary'}`}>
                {buttonProps.title}
            </Text>
        </TouchableOpacity>
    );
};