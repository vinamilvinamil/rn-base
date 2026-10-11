import { getDatabase } from "@/src/infrastructure/database/database";
import { DEFAULT_SETTINGS } from "@/src/shared/constants/defaults";
import type { AppSettings } from "../../domain/entities/AppSettings";
import type { SettingsRepository } from "../../domain/repositories/SettingsRepository";
export class SettingsRepositoryImpl implements SettingsRepository {
  async get(): Promise<AppSettings> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ key: string; value: string }>(
      "SELECT key,value FROM app_settings",
    );
    const saved = Object.fromEntries(
      rows.map((r) => [r.key, JSON.parse(r.value)]),
    );
    return { ...DEFAULT_SETTINGS, ...saved } as AppSettings;
  }
  async save(settings: AppSettings) {
    const db = await getDatabase();
    for (const [key, value] of Object.entries(settings))
      await db.runAsync(
        "INSERT OR REPLACE INTO app_settings (key,value) VALUES (?,?)",
        key,
        JSON.stringify(value),
      );
  }
}
