import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface CheckboxProps {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string;
  disabled?: boolean;
}

export const Checkbox = ({
  label,
  value,
  onChange,
  error,
  disabled = false,
}: CheckboxProps) => {
  return (
    <View style={styles.container}>
      <Pressable
        disabled={disabled}
        onPress={() => onChange(!value)}
        style={styles.row}>
        <View
          style={[
            styles.box,
            value && styles.checked,
            disabled && styles.disabled,
          ]}>
          {value && <Text style={styles.check}>✓</Text>}
        </View>

        {label && (
          <Text style={styles.label}>
            {label}
          </Text>
        )}
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  check: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  label: {
    marginLeft: 10,
    fontSize: 15,
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