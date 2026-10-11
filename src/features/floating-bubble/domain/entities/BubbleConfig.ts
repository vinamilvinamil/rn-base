export type BubbleConfig = {
  enabled: boolean;
  bubbleStyle: "minimal" | "detailed";
  intervalMinutes: number;
  breakDurationSeconds: number;

  // Xác định lịch nào đang được cấu hình
  type?: "micro" | "long";
  ruleId?: string;
};
