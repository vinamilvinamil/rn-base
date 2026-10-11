import type { ReminderRule } from "../entities/ReminderRule";
export interface ReminderRepository {
  getAll(): Promise<ReminderRule[]>;
  save(rule: ReminderRule): Promise<void>;
  delete(id: string): Promise<void>;
  update(rule: ReminderRule): Promise<void>;
}
