import { initializeDatabase } from "@/src/infrastructure/database/database";
import { configureNotificationChannel } from "@/src/infrastructure/notifications/NotificationService";
/** Idempotent app startup. Keep this safe to call more than once. */
export async function initializeApp() {
  await initializeDatabase();
  await configureNotificationChannel();
}
