import { AppText } from "@/src/shared/components/AppText";
import { View } from "react-native";
export function BubblePreview({ detailed = true }: { detailed?: boolean }) {
  return (
    <View
      style={{
        alignSelf: "flex-end",
        backgroundColor: "#149B91",
        borderRadius: 22,
        padding: 14,
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
      }}
    >
      <AppText>👁️</AppText>
      {detailed && (
        <AppText style={{ color: "#fff", fontWeight: "700" }}>
          Time to rest · 20s
        </AppText>
      )}
    </View>
  );
}
