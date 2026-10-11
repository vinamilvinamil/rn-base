import { AppButton } from "@/src/shared/components/AppButton";
import { AppHeader } from "@/src/shared/components/AppHeader";
import { AppText } from "@/src/shared/components/AppText";
import { Screen } from "@/src/shared/components/Screen";
export function ReminderEditorScreen({ ruleId }: { ruleId: string }) {
  return (
    <Screen>
      <AppHeader title={ruleId === "new" ? "Tạo lịch nhắc" : "Sửa lịch nhắc"} />
      <AppText>
        Editor MVP: lịch nhắc có thể quản lý ở màn hình Lịch nhắc. Form tuỳ
        chỉnh chi tiết sẽ bổ sung ở bản tiếp theo.
      </AppText>
      <AppButton
        title="Đã hiểu"
        onPress={() => {
          /* navigation handled by header back */
        }}
        variant="secondary"
      />
    </Screen>
  );
}
