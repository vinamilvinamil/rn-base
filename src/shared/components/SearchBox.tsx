import { Feather } from '@expo/vector-icons';
import {
    StyleProp,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

interface SearchBoxProps extends TextInputProps {
    containerStyle?: StyleProp<ViewStyle>
    enableClear?: boolean;
}

export const SearchBox = ({
    containerStyle,
    enableClear = false,
    ...textInputProps
}: SearchBoxProps) => {

    return (
        <View className='flex-row items-center gap-2 bg-white rounded-xl border border-[#E8E6DF] px-3.5 py-1.5'
            style={containerStyle}>
            <Feather name='search' size={15} color={'#8A8D96'} />
            <TextInput
                placeholderTextColor={'#8A8D96'}
                className='flex-1 text-sm text-brand-bg'
                {...textInputProps}
            />
            {
                (enableClear && (textInputProps?.value ?? '').length > 0) && (
                    <TouchableOpacity onPress={() => textInputProps?.onChangeText?.("")}>
                        <Feather name='x' size={15} color={'#8A8D96'} />
                    </TouchableOpacity>
                )
            }
        </View>
    );
};