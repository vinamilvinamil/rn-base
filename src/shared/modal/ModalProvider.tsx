import {
    createContext,
    PropsWithChildren,
    useCallback,
    useMemo,
    useState,
} from 'react';

import {
    ConfirmModal
} from '@/shared/components/ConfirmModal/ConfirmModal';

import {
    ResultModal
} from '@/shared/components/ResultModal/ResultModal';

import { useTranslation } from 'react-i18next';
import {
    ConfirmModalOptions,
    ModalContextValue,
    ResultModalOptions,
} from './types';

interface ConfirmState {
  visible: boolean;
  options: ConfirmModalOptions | null;
}

interface ResultState {
  visible: boolean;
  options: ResultModalOptions | null;
}

export const ModalContext = createContext<
  ModalContextValue | undefined
>(undefined);

export const ModalProvider = ({
  children,
}: PropsWithChildren) => {
 const {t} = useTranslation();
  const [confirmState, setConfirmState] =
    useState<ConfirmState>({
      visible: false,
      options: null,
    });

  const [resultState, setResultState] =
    useState<ResultState>({
      visible: false,
      options: null,
    });

  /**
   * Confirm Modal
   */
  const showConfirm = useCallback(
    (options: ConfirmModalOptions) => {
      setConfirmState({
        visible: true,
        options,
      });
    },
    [],
  );

  const dismissConfirm = useCallback(() => {
    setConfirmState(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    const onConfirm =
      confirmState.options?.onConfirm;

    setConfirmState(prev => ({
      ...prev,
      visible: false,
    }));
    requestAnimationFrame(() => {
        onConfirm?.();
    })
  }, [confirmState.options]);

  const handleCancel = useCallback(() => {
    const onCancel =
      confirmState.options?.onCancel;

    setConfirmState(prev => ({
      ...prev,
      visible: false,
    }));
    requestAnimationFrame(() => {
        onCancel?.();
    });
  }, [confirmState.options]);

  /**
   * Result Modal
   */
  const showResult = useCallback(
    (options: ResultModalOptions) => {
      setResultState({
        visible: true,
        options,
      });
    },
    [],
  );

  const dismissResult = useCallback(() => {
    setResultState(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const handleResultClose = useCallback(() => {
    const onClose =
      resultState.options?.onClose;

    setResultState(prev => ({
      ...prev,
      visible: false,
    }));

    onClose?.();
  }, [resultState.options]);

  const contextValue = useMemo<ModalContextValue>(
    () => ({
      showConfirm,
      showResult,
      dismissConfirm,
      dismissResult,
    }),
    [
      showConfirm,
      showResult,
      dismissConfirm,
      dismissResult,
    ],
  );

  const confirmOptions = confirmState.options;

  const resultOptions = resultState.options;

  return (
    <ModalContext.Provider value={contextValue}>
      {children}

      {/* Confirm */}
      {confirmOptions ? (
        <ConfirmModal
          visible={confirmState.visible}
          title={confirmOptions.title}
          message={confirmOptions.message}
          confirmText={
            confirmOptions.confirmText ?? t('common.confirm')
          }
          cancelText={
            confirmOptions.cancelText ?? t('common.cancel')
          }
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      ) : null}

      {/* Result */}
      {resultOptions ? (
        <ResultModal
          visible={resultState.visible}
          type={resultOptions.type}
          title={resultOptions.title}
          message={resultOptions.message}
          onClose={handleResultClose}
        />
      ) : null}
    </ModalContext.Provider>
  );
};