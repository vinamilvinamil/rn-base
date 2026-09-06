import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  inputContainerStyle?: StyleProp<ViewStyle>
}

export const Input = ({
  label,
  error,
  leftElement,
  rightElement,
  inputContainerStyle,
  ...textInputProps
}: InputProps) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          inputContainerStyle,
          error && styles.inputError,
        ]}>
        {leftElement && (
          <View style={styles.leftElement}>
            {leftElement}
          </View>
        )}

        <TextInput
          {...textInputProps}
          style={styles.input}
        />

        {rightElement && (
          <View style={styles.rightElement}>
            {rightElement}
          </View>
        )}
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
    width: '100%',
    marginBottom: 16,
  },

  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
  },

  inputContainer: {
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  inputError: {
    borderColor: '#EF4444',
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 0,
    fontSize: 16,
  },

  leftElement: {
    marginRight: 8,
  },

  rightElement: {
    marginLeft: 8,
  },

  error: {
    marginTop: 4,
    fontSize: 12,
    color: '#EF4444',
  },
});