import { create } from "zustand";
export type ActiveBreak = {
  startedAt: number;
  durationSeconds: number;
  remainingSeconds: number;
} | null;
type BreakState = {
  activeBreak: ActiveBreak;
  start: (durationSeconds: number) => void;
  tick: () => void;
  finish: () => void;
};
export const useBreakStore = create<BreakState>((set, get) => ({
  activeBreak: null,
  start: (durationSeconds) =>
    set({
      activeBreak: {
        startedAt: Date.now(),
        durationSeconds,
        remainingSeconds: durationSeconds,
      },
    }),
  tick: () => {
    const current = get().activeBreak;
    if (current)
      set({
        activeBreak: {
          ...current,
          remainingSeconds: Math.max(0, current.remainingSeconds - 1),
        },
      });
  },
  finish: () => set({ activeBreak: null }),
}));
