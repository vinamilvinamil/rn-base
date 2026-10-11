import { AppButton } from "@/src/shared/components/AppButton";
import { AppCard } from "@/src/shared/components/AppCard";
import { AppText } from "@/src/shared/components/AppText";
import { Screen } from "@/src/shared/components/Screen";
import { colors } from "@/src/shared/theme/colors";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
export function WelcomeScreen() {
  const router = useRouter();
  return (
    <Screen>
      <View style={s.hero}>
        <View style={s.eye}>
          <AppText style={{ fontSize: 48 }}>👁️</AppText>
        </View>
        <AppText variant="title" style={{ textAlign: "center" }}>
          Chăm sóc đôi mắt mỗi ngày
        </AppText>
        <AppText style={{ textAlign: "center", color: colors.muted }}>
          Những khoảng nghỉ nhỏ tạo nên khác biệt lớn.
        </AppText>
      </View>
      <AppCard>
        <AppText variant="heading">EyeCare đồng hành cùng bạn</AppText>
        <AppText>
          Nhắc nghỉ đúng lúc, bài tập thư giãn và thống kê thói quen — tất cả
          lưu ngay trên thiết bị.
        </AppText>
      </AppCard>
      <AppButton
        title="Bắt đầu"
        onPress={() => router.push("/(onboarding)/features")}
      />
    </Screen>
  );
}
const s = StyleSheet.create({
  hero: { alignItems: "center", gap: 14, paddingVertical: 36 },
  eye: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#DDF5EF",
    alignItems: "center",
    justifyContent: "center",
  },
});
