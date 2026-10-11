import { View } from 'react-native'; import { AppText } from './AppText'; import { AppButton } from './AppButton';
export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) { return <View style={{ padding: 20, gap: 12 }}><AppText>{message}</AppText>{onRetry && <AppButton title="Thử lại" onPress={onRetry} variant="secondary" />}</View>; }
