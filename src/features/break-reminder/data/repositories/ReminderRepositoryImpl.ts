import type { ReminderRule } from "../../domain/entities/ReminderRule";
import type { ReminderRepository } from "../../domain/repositories/ReminderRepository";
import { ReminderLocalDataSource } from "../datasources/ReminderLocalDataSource";
import {
  reminderFromDto,
  reminderToDto,
} from "../mappers/reminder-data.mapper";
export class ReminderRepositoryImpl implements ReminderRepository {
  constructor(private source = new ReminderLocalDataSource()) {}
  async getAll() {
    return (await this.source.getAll()).map(reminderFromDto);
  }
  save(rule: ReminderRule) {
    return this.source.save(reminderToDto(rule));
  }
  delete(id: string) {
    return this.source.delete(id);
  }
  async update(rule: ReminderRule): Promise<void> {
    await this.save(rule);
  }
}
