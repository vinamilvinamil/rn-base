import { useColors } from '@/shared/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import {
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
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

export interface ResultModalOptions {
  type: ResultModalType;
  title: string;
  message?: string;
  onClose?: () => void;
}

export interface ResultModalRef {
  show: (options: ResultModalOptions) => void;
  dismiss: () => void;
}

interface ResultModalState extends ResultModalOptions {
  visible: boolean;
}

const ICONS: Record<ResultModalType, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'close-circle',
  warning: 'warning',
  info: 'information-circle',
};

const ResultModalRef = forwardRef<ResultModalRef>((_, ref) => {
  const colors = useColors();
  const {t} = useTranslation();

  const [state, setState] = useState<ResultModalState>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  useImperativeHandle(ref, () => ({
    show: options => {
      setState({
        visible: true,
        ...options,
      });
    },

    dismiss: () => {
      setState(prev => ({
        ...prev,
        visible: false,
      }));
    },
  }));

  const handleClose = () => {
    const onClose = state.onClose;

    setState(prev => ({
      ...prev,
      visible: false,
    }));

    // Chạy sau khi modal được đóng
    requestAnimationFrame(() => {
      onClose?.();
    });
  };

  const getIconColor = () => {
    switch (state.type) {
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
      visible={state.visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}>
      {/* Backdrop */}
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        {/* Modal */}
        <View className="w-full max-w-[380px] rounded-2xl bg-background px-6 pb-6 pt-7">
          {/* Close button */}
          <Pressable
            onPress={handleClose}
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
              name={ICONS[state.type]}
              size={64}
              color={iconColor}
            />
          </View>

          {/* Title */}
          <Text className="text-center text-xl font-semibold text-text">
            {state.title}
          </Text>

          {/* Message */}
          {state.message ? (
            <Text className="mt-2 text-center text-sm leading-5 text-text-secondary">
              {state.message}
            </Text>
          ) : null}

          {/* Close button */}
          <Pressable
            onPress={handleClose}
            className="mt-6 h-12 items-center justify-center rounded-lg bg-primary active:opacity-80">
            <Text className="text-base font-semibold text-white">
              {t('common.close')}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
});

ResultModalRef.displayName = 'ResultModalRef';

export default ResultModalRef;