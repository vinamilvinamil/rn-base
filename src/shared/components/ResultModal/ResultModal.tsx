import { useColors } from '@/shared/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
    Modal,
    Pressable,
    Text,
    View,
} from 'react-native';

export type ResultModalType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface ResultModalProps {
  visible: boolean;

  type: ResultModalType;
  title: string;
  message?: string;

  onClose: () => void;
}

const ICONS: Record<
  ResultModalType,
  keyof typeof Ionicons.glyphMap
> = {
  success: 'checkmark-circle',
  error: 'close-circle',
  warning: 'warning',
  info: 'information-circle',
};

export const ResultModal = ({
  visible,
  type,
  title,
  message,
  onClose,
}: ResultModalProps) => {
  const {t} = useTranslation();
  const colors = useColors();

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return colors.success;

      case 'error':
        return colors.error;

      case 'warning':
        return colors.warning;

      case 'info':
      default:
        return colors.info;
    }
  };

  const iconColor = getIconColor();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-[380px] rounded-2xl bg-background px-6 pb-6 pt-7">
          {/* Close */}
          <Pressable
            onPress={onClose}
            hitSlop={10}
            className="absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-full">
            <Ionicons
              name="close"
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>

          {/* Icon */}
          <View className="mb-4 items-center">
            <Ionicons
              name={ICONS[type]}
              size={64}
              color={iconColor}
            />
          </View>

          {/* Title */}
          <Text className="text-center text-xl font-semibold text-text">
            {title}
          </Text>

          {/* Message */}
          {message ? (
            <Text className="mt-2 text-center text-sm leading-5 text-text-secondary">
              {message}
            </Text>
          ) : null}

          {/* Close button */}
          <Pressable
            onPress={onClose}
            className="mt-6 h-12 items-center justify-center rounded-lg bg-primary active:opacity-80">
            <Text className="text-base font-semibold text-white">
              {t('common.close')}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};