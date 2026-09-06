import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  BottomSheet,
  type BottomSheetRef,
} from '../BottomSheet';
import { Input } from '../Input';

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

interface SelectProps<T = string> {
  label?: string;
  placeholder?: string;
  value?: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  error?: string;
  disabled?: boolean;

  bottomSheetTitle?: string;

  /**
   * Hiển thị ô tìm kiếm trong BottomSheet
   */
  enableSearch?: boolean;

  /**
   * Placeholder của ô tìm kiếm
   */
  searchPlaceholder?: string;
}

export const Select = <T,>({
  label,
  placeholder,
  value,
  options,
  onChange,
  error,
  disabled = false,
  bottomSheetTitle,
  enableSearch = false,
  searchPlaceholder,
}: SelectProps<T>) => {
  const { t } = useTranslation();

  const bottomSheetRef = React.useRef<BottomSheetRef>(null);

  const [search, setSearch] = React.useState('');

  const selectedOption = options.find(
    option => option.value === value,
  );

  const filteredOptions = useMemo(() => {
    if (!enableSearch || !search.trim()) {
      return options;
    }

    const keyword = search.trim().toLowerCase();

    return options.filter(option =>
      option.label.toLowerCase().includes(keyword),
    );
  }, [options, search, enableSearch]);

  const handleOpen = () => {
    if (disabled) {
      return;
    }
    Keyboard.dismiss();
    setSearch('');
    bottomSheetRef.current?.present();
  };

  const handleSelect = (option: SelectOption<T>) => {
    onChange(option.value);
    bottomSheetRef.current?.dismiss();
    setSearch('');
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        disabled={disabled}
        onPress={handleOpen}
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.disabled,
        ]}>
        <Text
          numberOfLines={1}
          style={[
            styles.value,
            !selectedOption && styles.placeholder,
          ]}>
          {selectedOption?.label ??
            placeholder ??
            t('common.select')}
        </Text>

        <Ionicons
          name="chevron-down"
          size={20}
          color="#6B7280"
        />
      </Pressable>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        title={bottomSheetTitle ?? label}
        snapPoints={['50%', '80%']}>

        {enableSearch && (
          <View style={styles.searchContainer}>
            <Input
              value={search}
              onChangeText={setSearch}
              placeholder={
                searchPlaceholder ??
                t('common.search')
              }
              leftElement={
                <Ionicons
                  name="search-outline"
                  size={20}
                  color="#6B7280"
                />
              }
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>
        )}

        <FlatList
          data={filteredOptions}
          keyExtractor={(item, index) =>
            `${String(item.value)}-${index}`
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.optionsContainer,
            filteredOptions.length === 0 &&
            styles.emptyContainer,
          ]}
          renderItem={({ item }) => {
            const isSelected = item.value === value;

            return (
              <Pressable
                onPress={() => handleSelect(item)}
                style={[
                  styles.option,
                  isSelected && styles.selectedOption,
                ]}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.optionText,
                    isSelected &&
                    styles.selectedOptionText,
                  ]}>
                  {item.label}
                </Text>

                {isSelected && (
                  <Ionicons
                    name="checkmark"
                    size={22}
                    color="#2563EB"
                  />
                )}
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="search-outline"
                size={32}
                color="#9CA3AF"
              />

              <Text style={styles.emptyText}>
                {t('common.noResults')}
              </Text>
            </View>
          }
        />
      </BottomSheet>
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
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  inputError: {
    borderColor: '#EF4444',
  },

  disabled: {
    opacity: 0.5,
  },

  value: {
    flex: 1,
    marginRight: 8,
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

  searchContainer: {
    paddingTop: 8,
    paddingBottom: 4,
  },

  optionsContainer: {
    paddingTop: 4,
    paddingBottom: 24,
  },

  emptyContainer: {
    flexGrow: 1,
  },

  option: {
    minHeight: 52,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectedOption: {
    backgroundColor: '#EFF6FF',
  },

  optionText: {
    flex: 1,
    marginRight: 8,
    fontSize: 16,
    color: '#111827',
  },

  selectedOptionText: {
    color: '#2563EB',
    fontWeight: '600',
  },

  empty: {
    flex: 1,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
});