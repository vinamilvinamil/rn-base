import type { Exercise } from '../entities/Exercise'; export interface ExerciseRepository { getAll(): Exercise[]; getById(id: string): Exercise | undefined }
