import type { ReminderRepository } from '../repositories/ReminderRepository';
export class DeleteReminderRule { constructor(private repo: ReminderRepository) {} execute(id: string) { return this.repo.delete(id); } }
