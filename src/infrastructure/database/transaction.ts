import { getDatabase } from "./database";
export async function withTransaction<T>(work: () => Promise<T>): Promise<T> {
  const db = await getDatabase();
  await db.execAsync("BEGIN");
  try {
    const result = await work();
    await db.execAsync("COMMIT");
    return result;
  } catch (error) {
    await db.execAsync("ROLLBACK");
    throw error;
  }
}
