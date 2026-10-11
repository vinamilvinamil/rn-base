import type { BreakSessionRepository } from '../repositories/BreakSessionRepository'; import type { BreakSession } from '../entities/BreakSession';
export class CompleteBreak { constructor(private repo: BreakSessionRepository) {} execute(session: BreakSession) { return this.repo.save({ ...session, completedAt: new Date().toISOString(), status: 'completed' }); } }
