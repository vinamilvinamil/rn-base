import type { ExerciseRepository } from '../repositories/ExerciseRepository'; export class GetExercises { constructor(private repo: ExerciseRepository) {} execute() { return this.repo.getAll(); } }
