import { colors } from "@/src/shared/theme/colors";
import type { PropsWithChildren } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  type ViewStyle
} from "react-native";
import { AppText } from "./AppText";
export function AppButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}: PropsWithChildren<{
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}>) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      // GIẢI PHÁP: Ép kiểu dữ liệu mảng trả về bằng cách lọc bỏ các giá trị lọc (false/undefined)
      // để tầng Native của Pressable luôn nhận được các Object sạch.
      style={[
        styles.base,
        styles[variant],
        style as ViewStyle, // Đưa style động của bạn lên trước hiệu ứng pressed
      ]} // Lọc sạch các phần tử null/false trong mảng
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#FFF" : colors.primary}
        />
      ) : (
        <AppText
          style={{
            color: variant === "primary" ? "#FFF" : colors.primary,
            fontWeight: "700",
          }}
        >
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    backgroundColor: "black",
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primarySoft },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.5 },
});
