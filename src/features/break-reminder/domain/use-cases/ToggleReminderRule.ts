import type { ReminderRule } from "../entities/ReminderRule";
import type { ReminderRepository } from "../repositories/ReminderRepository";
export class ToggleReminderRule {
  constructor(private repo: ReminderRepository) {}
  async execute(rule: ReminderRule, enabled: boolean) {
    const next = { ...rule, enabled, updatedAt: new Date().toISOString() };
    await this.repo.save(next);
    return next;
  }
}
