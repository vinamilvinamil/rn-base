import '@/infrastructure/i18n';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import {
  Stack
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import '../global.css';

import { useAuthBootstrap } from '@/features/auth/presentation/hooks/useAuthBootstrap';
import { ToastProvider } from '@/infrastructure/toast/ToastProvider';
import { ThemeProvider } from '@/shared/components/ThemeProvider';
import { ModalProvider } from '@/shared/modal';
import { store } from '@/store';
import {
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function AppContent() {
  useAuthBootstrap();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <ToastProvider />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{flex: 1}}>
            <BottomSheetModalProvider>
                <ModalProvider>
                  <AppContent />
                </ModalProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}