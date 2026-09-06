import Toast from 'react-native-toast-message';

export type ToastType = 'success' | 'error' | 'info';

interface ShowToastParams {
  type: ToastType;
  messageKey: string;
  titleKey?: string;
}

export const toastService = {
  show({
    type,
    messageKey,
    titleKey,
  }: ShowToastParams) {
    Toast.show({
      type,
      props: {
        messageKey,
        titleKey,
      },
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
    });
  },

  success(messageKey: string, titleKey?: string) {
    this.show({
      type: 'success',
      messageKey,
      titleKey,
    });
  },

  error(messageKey: string, titleKey?: string) {
    this.show({
      type: 'error',
      messageKey,
      titleKey,
    });
  },

  info(messageKey: string, titleKey?: string) {
    this.show({
      type: 'info',
      messageKey,
      titleKey,
    });
  },

  hide() {
    Toast.hide();
  },
};