import { scheduleBreakNotification } from '@/src/infrastructure/notifications/NotificationService';
export class SnoozeBreak { async execute(minutes: number) { return scheduleBreakNotification(minutes * 60, 'EyeCare reminder', 'Đã hết thời gian hoãn — hãy nghỉ mắt nhé.'); } }
