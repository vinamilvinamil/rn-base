import { getDatabase } from "@/src/infrastructure/database/database";
import { startOfLocalDay } from "@/src/shared/utils/date";
export class DashboardLocalDataSource {
  async getSummary() {
    const db = await getDatabase();
    const day = startOfLocalDay().toISOString();
    const row = await db.getFirstAsync<{ completed: number; skipped: number }>(
      "SELECT SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed, SUM(CASE WHEN status = 'skipped' THEN 1 ELSE 0 END) AS skipped FROM break_sessions WHERE started_at >= ?",
      day,
    );
    return {
      completedBreaks: row?.completed ?? 0,
      skippedBreaks: row?.skipped ?? 0,
      longestSessionMinutes: 0,
      streakDays: 0,
      nextBreakMinutes: 20,
    };
  }
}
