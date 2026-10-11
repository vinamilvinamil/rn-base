import type { BreakSession } from '../entities/BreakSession';
export interface BreakSessionRepository { save(session: BreakSession): Promise<void>; getRecent(limit?: number): Promise<BreakSession[]>; countCompletedSince(isoDate: string): Promise<number> }
