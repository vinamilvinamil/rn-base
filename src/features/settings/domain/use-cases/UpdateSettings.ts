import type { SettingsRepository } from '../repositories/SettingsRepository'; import type { AppSettings } from '../entities/AppSettings';
export class UpdateSettings { constructor(private repo: SettingsRepository) {} async execute(current: AppSettings, patch: Partial<AppSettings>) { const next = { ...current, ...patch }; await this.repo.save(next); return next; } }
