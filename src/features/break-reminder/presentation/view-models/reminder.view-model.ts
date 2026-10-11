import type { ReminderRule } from '../../domain/entities/ReminderRule';
export function reminderLabel(rule: ReminderRule) { return rule.type === 'micro' ? 'Micro break' : 'Long break'; }
