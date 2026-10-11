/**
 * src/infrastructure/native/EyeCareOverlay.ts
 *
 * Facade quản lý floating bubble trên Android.
 *
 * - Android: gọi native module EyeCareOverlay.
 * - iOS: không hỗ trợ overlay nổi trên ứng dụng khác.
 * - Expo Go: không hỗ trợ nếu chưa tích hợp native module.
 */

import { requireNativeModule } from "expo-modules-core";
import { Linking, Platform } from "react-native";

// ============================================================
// Types
// ============================================================

export type BubbleStyle = "minimal" | "detailed";

export interface OverlayConfig {
  enabled: boolean;
  bubbleStyle: BubbleStyle;
  intervalMinutes: number;
  breakDurationSeconds: number;
}

export interface OverlayStatus {
  running: boolean;
  permissionGranted: boolean;
}

interface EyeCareOverlayNativeModule {
  canDrawOverlays(): Promise<boolean>;
  openOverlaySettings(): Promise<void>;
  startOverlay(config: OverlayConfig): Promise<void>;
  updateOverlay(config: OverlayConfig): Promise<void>;
  stopOverlay(): Promise<void>;
  getOverlayStatus(): Promise<OverlayStatus>;
}

// ============================================================
// Native module loader
// ============================================================

function getNativeModule(): EyeCareOverlayNativeModule {
  if (Platform.OS !== "android") {
    throw new Error("EyeCare floating overlay chỉ được hỗ trợ trên Android.");
  }

  try {
    return requireNativeModule<EyeCareOverlayNativeModule>("EyeCareOverlay");
  } catch (error) {
    console.error("[EyeCareOverlay] Không thể tải native module.", error);

    throw new Error(
      "Không tìm thấy native module EyeCareOverlay. " +
        "Hãy kiểm tra cấu hình Expo Module và build lại ứng dụng Android.",
    );
  }
}

// ============================================================
// Public API
// ============================================================

export const EyeCareOverlay = {
  /**
   * Cho biết nền tảng có thể hỗ trợ overlay hay không.
   * Không đảm bảo native module đã được cài đặt.
   */
  isSupported: Platform.OS === "android",

  /**
   * Kiểm tra quyền SYSTEM_ALERT_WINDOW.
   *
   * Trả về false nếu Android chưa cấp quyền.
   * Ném lỗi nếu native module không khả dụng.
   */
  async canDrawOverlays(): Promise<boolean> {
    return getNativeModule().canDrawOverlays();
  },

  /**
   * Mở trang cài đặt quyền overlay của Android.
   */
  async openOverlaySettings(): Promise<void> {
    const nativeModule = getNativeModule();
    await nativeModule.openOverlaySettings();
  },

  /**
   * Khởi động floating bubble.
   */
  async startOverlay(config: OverlayConfig): Promise<void> {
    const nativeModule = getNativeModule();

    const permissionGranted = await nativeModule.canDrawOverlays();

    if (!permissionGranted) {
      throw new Error("Chưa cấp quyền Display over other apps cho EyeCare.");
    }

    await nativeModule.startOverlay(config);
  },

  /**
   * Cập nhật cấu hình bubble đang hoạt động.
   */
  async updateOverlay(config: OverlayConfig): Promise<void> {
    const nativeModule = getNativeModule();
    await nativeModule.updateOverlay(config);
  },

  /**
   * Dừng floating bubble.
   */
  async stopOverlay(): Promise<void> {
    const nativeModule = getNativeModule();
    await nativeModule.stopOverlay();
  },

  /**
   * Lấy trạng thái service và quyền overlay.
   */
  async getOverlayStatus(): Promise<OverlayStatus> {
    const nativeModule = getNativeModule();
    return nativeModule.getOverlayStatus();
  },

  /**
   * Mở cài đặt ứng dụng nếu cần xử lý thủ công.
   */
  async openAppSettings(): Promise<void> {
    await Linking.openSettings();
  },
};
