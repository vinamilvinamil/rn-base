import { useColors } from '@/shared/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import {
    Modal,
    Pressable,
    Text,
    View,
} from 'react-native';

export interface ConfirmModalProps {
  visible: boolean;

  title: string;
  message?: string;

  confirmText: string;
  cancelText: string;

  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-[380px] rounded-2xl bg-background px-6 pb-6 pt-7">
          {/* Close */}
          <Pressable
            onPress={onCancel}
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
              name="help-circle"
              size={64}
              color={colors.warning}
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

          {/* Actions */}
          <View className="mt-6 flex-row gap-3">
            {/* Cancel */}
            <Pressable
              onPress={onCancel}
              className="h-12 flex-1 items-center justify-center rounded-lg border border-border bg-background-secondary active:opacity-80">
              <Text className="text-base font-semibold text-text">
                {cancelText}
              </Text>
            </Pressable>

            {/* Confirm */}
            <Pressable
              onPress={onConfirm}
              className="h-12 flex-1 items-center justify-center rounded-lg bg-primary active:opacity-80">
              <Text className="text-base font-semibold text-white">
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};