import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';

interface NumberInputProps {
  label?: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  inputContainerStyle?: StyleProp<ViewStyle>
}

export const NumberInput = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  min,
  max,
  inputContainerStyle,
}: NumberInputProps) => {
  const [text, setText] = React.useState(
    value !== undefined ? String(value) : '',
  );

  React.useEffect(() => {
    setText(value !== undefined ? String(value) : '');
  }, [value]);

  const handleChange = (input: string) => {
    // Chỉ cho phép số
    if (!/^\d*\.?\d*$/.test(input)) {
      return;
    }

    setText(input);

    if (input === '') {
      onChange(undefined);
      return;
    }

    const number = Number(input);

    if (Number.isNaN(number)) {
      return;
    }

    if (min !== undefined && number < min) {
      return;
    }

    if (max !== undefined && number > max) {
      return;
    }

    onChange(number);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}

      <View style={[
        styles.inputContainer,
        inputContainerStyle,
        error && styles.inputError,
        disabled && styles.disabled,
      ]}>
        <TextInput
          value={text}
          style={styles.input}
          onChangeText={handleChange}
          placeholder={placeholder}
          editable={!disabled}
          keyboardType="decimal-pad"

        />
      </View>

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 0,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: '#EF4444',
  },
});