export type ExerciseSession = { id: string; exerciseId: string; startedAt: string; completedAt?: string; durationSeconds: number; status: 'completed'|'interrupted' };
