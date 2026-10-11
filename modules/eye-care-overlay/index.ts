import { requireNativeModule } from 'expo-modules-core';
export type OverlayConfig = { enabled: boolean; bubbleStyle: 'minimal'|'detailed'; intervalMinutes: number; breakDurationSeconds: number };
export type OverlayStatus = { running: boolean; permissionGranted: boolean };
type NativeOverlayModule = { canDrawOverlays(): Promise<boolean>; openOverlaySettings(): Promise<void>; startOverlay(config: OverlayConfig): Promise<void>; updateOverlay(config: OverlayConfig): Promise<void>; stopOverlay(): Promise<void>; getOverlayStatus(): Promise<OverlayStatus> };
export default requireNativeModule<NativeOverlayModule>('EyeCareOverlay');
