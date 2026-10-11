import { ReminderEditorScreen } from "@/src/features/break-reminder/presentation/screens/ReminderEditorScreen";
import { useLocalSearchParams } from "expo-router";
export default function ReminderEditRoute() {
  const { ruleId } = useLocalSearchParams<{ ruleId: string }>();
  return <ReminderEditorScreen ruleId={ruleId ?? "new"} />;
}
