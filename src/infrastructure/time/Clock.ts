export interface Clock { now(): Date; nowMs(): number }
export const SystemClock: Clock = { now: () => new Date(), nowMs: () => Date.now() };
