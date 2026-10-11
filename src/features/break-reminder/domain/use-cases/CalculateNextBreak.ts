import type { ReminderRule } from '../entities/ReminderRule'; import { calculateNextBreakAt } from '../policies/ReminderPolicy';
export class CalculateNextBreak { execute(lastBreakAt: Date, rule: ReminderRule) { return calculateNextBreakAt(lastBreakAt, rule); } }
