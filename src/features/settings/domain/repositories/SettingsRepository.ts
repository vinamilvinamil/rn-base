import type { AppSettings } from '../entities/AppSettings';
export interface SettingsRepository { get(): Promise<AppSettings>; save(settings: AppSettings): Promise<void> }
