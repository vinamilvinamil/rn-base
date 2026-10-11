import { AppText } from "@/src/shared/components/AppText";
import { Screen } from "@/src/shared/components/Screen";
import { Link } from "expo-router";
export default function NotFound() {
  return (
    <Screen>
      <AppText variant="title">Không tìm thấy trang</AppText>
      <Link href="/(tabs)">Về trang chủ</Link>
    </Screen>
  );
}
