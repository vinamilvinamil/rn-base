import { DEFAULT_SETTINGS } from "@/src/shared/constants/defaults";
import { create } from "zustand";
export type Settings = {
  microBreakIntervalMinutes: number;
  microBreakDurationSeconds: number;
  longBreakIntervalMinutes: number;
  longBreakDurationMinutes: number;
  bubbleEnabled: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  snoozeMinutes: number;
};
type SettingsState = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  hydrate: (settings: Settings) => void;
};
export const useSettingsStore = create<SettingsState>((set) => ({
  settings: { ...DEFAULT_SETTINGS },
  update: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
  hydrate: (settings) => set({ settings }),
}));
