import type { ReminderRule } from "../entities/ReminderRule";
import type { ReminderRepository } from "../repositories/ReminderRepository";
export class UpdateReminderRule {
  constructor(private repo: ReminderRepository) {}
  //   async execute(rule: ReminderRule) {
  //     const updated = { ...rule, updatedAt: new Date().toISOString() };
  //     await this.repo.save(updated);
  //     return updated;
  //   }

  async execute(rule: ReminderRule): Promise<void> {
    await this.repo.update(rule);
  }
}
