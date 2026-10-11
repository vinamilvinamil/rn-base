import { getDatabase } from '../database'; import { CREATE_TABLES_SQL } from '../schema';
export async function migration001InitialSchema() { const db = await getDatabase(); await db.execAsync(CREATE_TABLES_SQL); }
