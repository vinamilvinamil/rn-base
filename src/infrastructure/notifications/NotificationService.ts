import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
export async function configureNotificationChannel() {
  if (Platform.OS === "android")
    await Notifications.setNotificationChannelAsync("break-reminders", {
      name: "Break reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 150, 250],
    });
}
export async function requestNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const result = await Notifications.requestPermissionsAsync();
  return result.granted;
}
export async function scheduleBreakNotification(
  seconds: number,
  title = "Time to rest!",
  body = "Look away from your screen for a moment.",
) {
  const allowed = await requestNotificationPermission();
  if (!allowed) return null;
  return Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true, data: { type: "break-reminder" } },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, seconds),
      channelId: "break-reminders",
    },
  });
}
export async function cancelAllBreakNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
