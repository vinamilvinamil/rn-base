export type OverlayConfig = {
  enabled: boolean;
  bubbleStyle: "minimal" | "detailed";
  intervalMinutes: number;
  breakDurationSeconds: number;
};
export type OverlayStatus = { running: boolean; permissionGranted: boolean };
