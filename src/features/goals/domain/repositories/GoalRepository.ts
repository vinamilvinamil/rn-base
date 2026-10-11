import type { Goal } from '../entities/Goal'; export interface GoalRepository { getAll(): Promise<Goal[]>; save(goal: Goal): Promise<void> }
