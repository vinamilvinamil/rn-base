import { getDatabase } from "@/src/infrastructure/database/database";
import { startOfLocalDay } from "@/src/shared/utils/date";
export class StatisticsLocalDataSource {
  async getSummary() {
    const db = await getDatabase();
    const start = startOfLocalDay().toISOString();
    const breaks = await db.getFirstAsync<{
      completed: number;
      skipped: number;
    }>(
      "SELECT SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed, SUM(CASE WHEN status = 'skipped' THEN 1 ELSE 0 END) AS skipped FROM break_sessions WHERE started_at >= ?",
      start,
    );
    const exercises = await db.getFirstAsync<{
      total: number;
      seconds: number;
    }>(
      "SELECT COUNT(*) AS total, SUM(duration_seconds) AS seconds FROM exercise_sessions WHERE status = 'completed' AND started_at >= ?",
      start,
    );
    return {
      completedBreaks: breaks?.completed ?? 0,
      skippedBreaks: breaks?.skipped ?? 0,
      exerciseCount: exercises?.total ?? 0,
      completedMinutes: Math.round((exercises?.seconds ?? 0) / 60),
    };
  }
}
