export type ReminderType = "micro" | "long";
export type ReminderRule = {
  id: string;
  type: ReminderType;
  intervalMinutes: number;
  durationSeconds: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};
