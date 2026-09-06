
import { ResultModalType } from '@/shared/components/ResultModal/ResultModal';

export interface ConfirmModalOptions {
  title: string;
  message?: string;

  confirmText?: string;
  cancelText?: string;

  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ResultModalOptions {
  type: ResultModalType;

  title: string;
  message?: string;

  onClose?: () => void;
}

export interface ModalContextValue {
  showConfirm: (options: ConfirmModalOptions) => void;
  showResult: (options: ResultModalOptions) => void;

  dismissConfirm: () => void;
  dismissResult: () => void;
}