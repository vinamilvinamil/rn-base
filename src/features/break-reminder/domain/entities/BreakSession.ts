export type BreakStatus = 'completed' | 'skipped' | 'interrupted';
export type BreakSession = { id: string; ruleId?: string | null; startedAt: string; completedAt?: string | null; durationSeconds: number; status: BreakStatus };
