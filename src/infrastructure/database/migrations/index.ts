import { migration001InitialSchema } from './001_initial_schema'; import { migration002BreakEvents } from './002_add_break_events';
export async function runMigrations() { await migration001InitialSchema(); await migration002BreakEvents(); }
