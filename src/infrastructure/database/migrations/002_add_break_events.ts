import { getDatabase } from '../database';
export async function migration002BreakEvents() { const db = await getDatabase(); await db.execAsync('CREATE TABLE IF NOT EXISTS break_events (id TEXT PRIMARY KEY NOT NULL, session_id TEXT, event_type TEXT NOT NULL, created_at TEXT NOT NULL);'); }
