import { Ionicons } from '@expo/vector-icons';
import DateTimePickerNative from '@react-native-community/datetimepicker';
import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface DateTimePickerProps {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time';
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const DateTimePicker = ({
  label,
  value,
  onChange,
  mode = 'date',
  placeholder = 'Select date',
  error,
  disabled = false,
}: DateTimePickerProps) => {
  const [visible, setVisible] = React.useState(false);

  const handleChange = (
    _: unknown,
    selectedDate?: Date,
  ) => {
    setVisible(false);

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const displayValue = React.useMemo(() => {
    if (!value) {
      return placeholder;
    }

    if (mode === 'time') {
      return value.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return value.toLocaleDateString();
  }, [value, mode, placeholder]);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}

      <Pressable
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.disabled,
        ]}>
        <Text
          style={[
            styles.value,
            !value && styles.placeholder,
          ]}>
          {displayValue}
        </Text>

        <Ionicons
          name={
            mode === 'time'
              ? 'time-outline'
              : 'calendar-outline'
          }
          size={20}
          color="#6B7280"
        />
      </Pressable>

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      {visible && (
        <DateTimePickerNative
          value={value ?? new Date()}
          mode={mode}
          display={
            Platform.OS === 'ios'
              ? 'spinner'
              : 'default'
          }
          onChange={handleChange}
        />
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
    color: '#111827',
  },

  input: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },

  inputError: {
    borderColor: '#EF4444',
  },

  disabled: {
    opacity: 0.5,
  },

  value: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },

  placeholder: {
    color: '#9CA3AF',
  },

  error: {
    marginTop: 4,
    fontSize: 12,
    color: '#EF4444',
  },
});