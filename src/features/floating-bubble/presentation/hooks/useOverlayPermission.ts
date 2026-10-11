import { EyeCareOverlay } from "@/src/infrastructure/native/EyeCareOverlay";
import { useCallback, useState } from "react";
export function useOverlayPermission() {
  const [granted, setGranted] = useState(false);
  const refresh = useCallback(
    async () => setGranted(await EyeCareOverlay.canDrawOverlays()),
    [],
  );
  const openSettings = () => EyeCareOverlay.openOverlaySettings();
  return { granted, refresh, openSettings };
}
