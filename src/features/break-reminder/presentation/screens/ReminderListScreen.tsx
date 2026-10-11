import { useFloatingBubble } from "@/src/features/floating-bubble/presentation/hooks/useFloatingBubble";
import { AppButton } from "@/src/shared/components/AppButton";
import { AppCard } from "@/src/shared/components/AppCard";
import { AppHeader } from "@/src/shared/components/AppHeader";
import { AppText } from "@/src/shared/components/AppText";
import { Screen } from "@/src/shared/components/Screen";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	Switch,
	TextInput,
	View,
} from "react-native";

import { ReminderRepositoryImpl } from "../../data/repositories/ReminderRepositoryImpl";
import type { ReminderRule } from "../../domain/entities/ReminderRule";
import { CreateReminderRule } from "../../domain/use-cases/CreateReminderRule";
import { ToggleReminderRule } from "../../domain/use-cases/ToggleReminderRule";
import { UpdateReminderRule } from "../../domain/use-cases/UpdateReminderRule";

const repo = new ReminderRepositoryImpl();

type RuleDraft = {
  hours: string;
  minutes: string;
  durationSeconds: string;
};

type ReminderType = "micro" | "long";

const DEFAULT_RULES: {
  type: ReminderType;
  intervalMinutes: number;
  durationSeconds: number;
}[] = [
  {
    type: "micro",
    intervalMinutes: 20,
    durationSeconds: 20,
  },
  {
    type: "long",
    intervalMinutes: 90,
    durationSeconds: 300,
  },
];

function toDraft(rule: ReminderRule): RuleDraft {
  return {
    hours: String(Math.floor(rule.intervalMinutes / 60)),
    minutes: String(rule.intervalMinutes % 60),
    durationSeconds: String(rule.durationSeconds),
  };
}

function toIntervalMinutes(draft: RuleDraft): number {
  const hours = Number.parseInt(draft.hours || "0", 10);
  const minutes = Number.parseInt(draft.minutes || "0", 10);

  return Math.max(0, hours) * 60 + Math.max(0, minutes);
}

function formatInterval(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes) return `${hours} giờ ${minutes} phút`;
  if (hours) return `${hours} giờ`;
  return `${minutes} phút`;
}

function NumberField({
  label,
  value,
  onChangeText,
  maxLength = 4,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  maxLength?: number;
}) {
  return (
    <View style={{ flex: 1, gap: 6 }}>
      <AppText>{label}</AppText>

      <TextInput
        value={value}
        onChangeText={(text) => onChangeText(text.replace(/[^0-9]/g, ""))}
        keyboardType="number-pad"
        selectTextOnFocus
        maxLength={maxLength}
        placeholder="0"
        placeholderTextColor="#9CA3AF"
        style={{
          minHeight: 48,
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 12,
          paddingHorizontal: 12,
          fontSize: 16,
          color: "#111827",
          backgroundColor: "#FFFFFF",
        }}
      />
    </View>
  );
}

export function ReminderListScreen() {
  const [rules, setRules] = useState<ReminderRule[]>([]);
  const [drafts, setDrafts] = useState<Record<string, RuleDraft>>({});
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [togglingIds, setTogglingIds] = useState<string[]>([]);

  const { enable, update } = useFloatingBubble();
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      setLoading(true);

      let list = await repo.getAll();

      // Chỉ khởi tạo mặc định khi database hoàn toàn trống.
      if (list.length === 0) {
        const createRule = new CreateReminderRule(repo);

        for (const rule of DEFAULT_RULES) {
          await createRule.execute(rule);
        }

        list = await repo.getAll();
      }

      setRules(list);

      setDrafts(
        Object.fromEntries(list.map((rule) => [rule.id, toDraft(rule)])),
      );
    } catch (error) {
      console.error("Failed to load reminder rules:", error);

      Alert.alert("Không thể tải lịch nhắc", "Vui lòng thử tải lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setBusy = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    id: string,
    busy: boolean,
  ) => {
    setter((current) => {
      if (busy) {
        return current.includes(id) ? current : [...current, id];
      }

      return current.filter((item) => item !== id);
    });
  };

  const updateDraft = (
    ruleId: string,
    field: keyof RuleDraft,
    value: string,
  ) => {
    setDrafts((current) => ({
      ...current,
      [ruleId]: {
        ...current[ruleId],
        [field]: value,
      },
    }));
  };

  const getUpdatedRule = (rule: ReminderRule): ReminderRule | null => {
    const draft = drafts[rule.id];

    if (!draft) return null;

    const intervalMinutes = toIntervalMinutes(draft);
    const durationSeconds = Number.parseInt(draft.durationSeconds || "0", 10);

    if (intervalMinutes < 1) {
      Alert.alert("Thời gian không hợp lệ", "Khoảng nhắc phải ít nhất 1 phút.");
      return null;
    }

    if (durationSeconds < 5 || durationSeconds > 300) {
      Alert.alert(
        "Thời lượng nghỉ không hợp lệ",
        "Thời lượng nghỉ phải từ 5 đến 300 giây.",
      );
      return null;
    }

    return {
      ...rule,
      intervalMinutes,
      durationSeconds,
    };
  };

  const saveRule = async (rule: ReminderRule) => {
    const updatedRule = getUpdatedRule(rule);

    if (!updatedRule) return;

    setBusy(setSavingIds, rule.id, true);

    try {
      // Lưu cấu hình mới vào database trước.
      await new UpdateReminderRule(repo).execute(updatedRule);

      // Đồng bộ native nếu rule đang bật.
      if (updatedRule.enabled) {
        const success = await update({
          enabled: true,
          ruleId: updatedRule.id,
          type: updatedRule.type,
          intervalMinutes: updatedRule.intervalMinutes,
          breakDurationSeconds: updatedRule.durationSeconds,
          bubbleStyle: "detailed",
        });

        if (!success) {
          Alert.alert(
            "Chưa đồng bộ native",
            "Cấu hình đã lưu vào database nhưng native chưa xác nhận cập nhật.",
          );
          return;
        }
      }

      await load();

      Alert.alert("Đã lưu", "Cấu hình lịch nhắc đã được cập nhật.");
    } catch (error) {
      console.error("Failed to save reminder:", error);

      Alert.alert("Không thể lưu", "Vui lòng kiểm tra repository và thử lại.");
    } finally {
      setBusy(setSavingIds, rule.id, false);
    }
  };

  const toggleRule = async (rule: ReminderRule, enabled: boolean) => {
    setBusy(setTogglingIds, rule.id, true);

    try {
      const updatedRule = getUpdatedRule(rule);

      if (!updatedRule) return;

      const config = {
        enabled,
        ruleId: updatedRule.id,
        type: updatedRule.type,
        intervalMinutes: updatedRule.intervalMinutes,
        breakDurationSeconds: updatedRule.durationSeconds,
        bubbleStyle: "detailed" as const,
      };

      // Cập nhật native trước để tránh database báo bật
      // trong khi native từ chối do thiếu quyền.
      if (enabled) {
        const success = await enable(config);

        if (!success) {
          return;
        }
      } else {
        // Không gọi disable() vì disable sẽ tắt toàn bộ overlay.
        const success = await update(config);

        if (!success) {
          return;
        }
      }

      await new ToggleReminderRule(repo).execute(
        {
          ...updatedRule,
          enabled: rule.enabled,
        },
        enabled,
      );

      // Lưu lại khoảng thời gian và thời lượng đã chỉnh.
      await new UpdateReminderRule(repo).execute({
        ...updatedRule,
        enabled,
      });

      await load();
    } catch (error) {
      console.error("Failed to toggle reminder:", error);

      Alert.alert(
        "Không thể thay đổi lịch",
        "Vui lòng kiểm tra quyền overlay và thử lại.",
      );

      await load();
    } finally {
      setBusy(setTogglingIds, rule.id, false);
    }
  };

  const renderRule = (rule: ReminderRule) => {
    const draft = drafts[rule.id] ?? toDraft(rule);
    const saving = savingIds.includes(rule.id);
    const toggling = togglingIds.includes(rule.id);
    const isMicro = rule.type === "micro";

    const intervalMinutes = toIntervalMinutes(draft);

    return (
      <AppCard key={rule.id}>
        <View style={{ gap: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View style={{ flex: 1, gap: 4 }}>
              <AppText variant="heading">
                {isMicro ? "Micro break" : "Long break"}
              </AppText>

              <AppText>
                {isMicro
                  ? "Nghỉ ngắn, thường xuyên để thư giãn mắt."
                  : "Nghỉ dài sau thời gian làm việc liên tục."}
              </AppText>
            </View>

            <Switch
              value={rule.enabled}
              disabled={saving || toggling}
              onValueChange={(value) => {
                void toggleRule(rule, value);
              }}
            />
          </View>

          <View style={{ gap: 8 }}>
            <AppText variant="heading">Nhắc sau mỗi</AppText>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <NumberField
                label="Giờ"
                value={draft.hours}
                maxLength={2}
                onChangeText={(value) => updateDraft(rule.id, "hours", value)}
              />

              <NumberField
                label="Phút"
                value={draft.minutes}
                maxLength={2}
                onChangeText={(value) => updateDraft(rule.id, "minutes", value)}
              />
            </View>

            <AppText>Chu kỳ: {formatInterval(intervalMinutes)}</AppText>
          </View>

          <View style={{ gap: 8 }}>
            <AppText variant="heading">Thời lượng nghỉ</AppText>

            <NumberField
              label="Giây (5–300)"
              value={draft.durationSeconds}
              maxLength={3}
              onChangeText={(value) =>
                updateDraft(rule.id, "durationSeconds", value)
              }
            />
          </View>

          <AppButton
            title={saving ? "Đang lưu..." : "Lưu cấu hình"}
            disabled={saving || toggling}
            onPress={() => {
              void saveRule(rule);
            }}
          />
        </View>
      </AppCard>
    );
  };

  return (
    <Screen>
      <AppHeader title="Lịch nhắc nghỉ" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 24,
        }}
      >
        <AppText>
          Thiết lập chu kỳ và thời lượng nghỉ riêng cho từng lịch.
        </AppText>

        {loading ? (
          <View
            style={{
              alignItems: "center",
              paddingVertical: 32,
              gap: 12,
            }}
          >
            <ActivityIndicator size="large" />
            <AppText>Đang tải lịch nhắc...</AppText>
          </View>
        ) : (
          <>
            {rules.map(renderRule)}

            {rules.length === 0 && (
              <AppCard>
                <AppText>Chưa có lịch nhắc nào.</AppText>
              </AppCard>
            )}
          </>
        )}

        <AppButton
          title="Tải lại danh sách"
          variant="secondary"
          disabled={loading}
          onPress={() => {
            void load();
          }}
        />

        <AppButton
          title="Cài đặt bubble"
          variant="secondary"
          onPress={() => router.push("/settings/bubble")}
        />
      </ScrollView>
    </Screen>
  );
}
