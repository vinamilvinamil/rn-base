import { getDatabase } from "@/src/infrastructure/database/database";
import type { ReminderRuleDto } from "../dto/ReminderRuleDto";
export class ReminderLocalDataSource {
  async getAll(): Promise<ReminderRuleDto[]> {
    const db = await getDatabase();
    return db.getAllAsync<ReminderRuleDto>(
      "SELECT * FROM reminder_rules ORDER BY created_at ASC",
    );
  }
  async save(d: ReminderRuleDto) {
    const db = await getDatabase();
    await db.runAsync(
      "INSERT OR REPLACE INTO reminder_rules (id,type,interval_minutes,duration_seconds,enabled,created_at,updated_at) VALUES (?,?,?,?,?,?,?)",
      d.id,
      d.type,
      d.interval_minutes,
      d.duration_seconds,
      d.enabled,
      d.created_at,
      d.updated_at,
    );
  }
  async delete(id: string) {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM reminder_rules WHERE id = ?", id);
  }
}
