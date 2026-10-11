export function startOfLocalDay(date = new Date()) { const value = new Date(date); value.setHours(0, 0, 0, 0); return value; }
export function toIso(date: Date) { return date.toISOString(); }
