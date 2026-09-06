import { useTranslation } from 'react-i18next';
import Toast, {
    BaseToast,
    ErrorToast,
    ToastConfig,
} from 'react-native-toast-message';

const ToastContent = ({props}: any) => {
  const {t} = useTranslation();

  const message = props.messageKey
    ? t(props.messageKey)
    : '';

  const title = props.titleKey
    ? t(props.titleKey)
    : undefined;

  return (
    <BaseToast
      text1={title}
      text2={message}
      {...props}
    />
  );
};

const ErrorToastContent = ({props}: any) => {
  const {t} = useTranslation();

  const message = props.messageKey
    ? t(props.messageKey)
    : '';

  const title = props.titleKey
    ? t(props.titleKey)
    : undefined;

  return (
    <ErrorToast
      text1={title}
      text2={message}
      {...props}
    />
  );
};

const toastConfig: ToastConfig = {
  success: ToastContent,
  info: ToastContent,
  error: ErrorToastContent,
};

export const ToastProvider = () => {
  return <Toast config={toastConfig} />;
};