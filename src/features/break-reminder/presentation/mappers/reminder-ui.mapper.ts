import type { ReminderRule } from '../../domain/entities/ReminderRule';
export function reminderToUi(rule: ReminderRule) { return { ...rule, intervalLabel: `Mỗi ${rule.intervalMinutes} phút`, durationLabel: `${rule.durationSeconds} giây` }; }
