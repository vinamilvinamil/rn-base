import type { ReminderRepository } from '../repositories/ReminderRepository';
export class GetReminderRules { constructor(private repo: ReminderRepository) {} execute() { return this.repo.getAll(); } }
