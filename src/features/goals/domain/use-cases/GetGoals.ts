import type { GoalRepository } from '../repositories/GoalRepository'; export class GetGoals { constructor(private repo: GoalRepository) {} execute() { return this.repo.getAll(); } }
