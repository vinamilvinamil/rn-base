import { AppText } from "@/src/shared/components/AppText";
import { Pressable, View } from "react-native";
export function BubbleStyleSelector({
  value,
  onChange,
}: {
  value: "minimal" | "detailed";
  onChange: (v: "minimal" | "detailed") => void;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      <Pressable
        onPress={() => onChange("minimal")}
        style={{
          padding: 12,
          borderRadius: 12,
          backgroundColor: value === "minimal" ? "#DDF5EF" : "#F5F8F7",
        }}
      >
        <AppText>Tối giản</AppText>
      </Pressable>
      <Pressable
        onPress={() => onChange("detailed")}
        style={{
          padding: 12,
          borderRadius: 12,
          backgroundColor: value === "detailed" ? "#DDF5EF" : "#F5F8F7",
        }}
      >
        <AppText>Chi tiết</AppText>
      </Pressable>
    </View>
  );
}
