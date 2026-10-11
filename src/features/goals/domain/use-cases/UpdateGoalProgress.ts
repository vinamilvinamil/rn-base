export class UpdateGoalProgress { execute(current: number, target: number) { return target <= 0 ? 0 : Math.min(1, current / target); } }
