import { requestNotificationPermission } from '@/src/infrastructure/notifications/NotificationService'; import { EyeCareOverlay } from '@/src/infrastructure/native/EyeCareOverlay';
export const PermissionService = { requestNotificationPermission, canDrawOverlays: () => EyeCareOverlay.canDrawOverlays(), openOverlaySettings: () => EyeCareOverlay.openOverlaySettings() };
