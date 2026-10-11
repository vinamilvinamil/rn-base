import {
    EyeCareOverlay,
    type OverlayConfig,
} from "@/src/infrastructure/native/EyeCareOverlay";
export class OverlayNativeDataSource {
  getStatus() {
    return EyeCareOverlay.isSupported
      ? EyeCareOverlay.canDrawOverlays().then((permissionGranted) => ({
          running: false,
          permissionGranted,
        }))
      : Promise.resolve({ running: false, permissionGranted: false });
  }
  start(c: OverlayConfig) {
    return EyeCareOverlay.startOverlay(c);
  }
  update(c: OverlayConfig) {
    return EyeCareOverlay.updateOverlay(c);
  }
  stop() {
    return EyeCareOverlay.stopOverlay();
  }
}
