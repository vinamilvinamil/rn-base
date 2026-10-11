import type { ReminderRule } from '../entities/ReminderRule';
export function calculateNextBreakAt(lastBreakAt: Date, rule: ReminderRule) { if (!rule.enabled) return null; return new Date(lastBreakAt.getTime() + rule.intervalMinutes * 60_000); }
