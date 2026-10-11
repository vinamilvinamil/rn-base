import { ExerciseDetailScreen } from "@/src/features/eye-exercises/presentation/screens/ExerciseDetailScreen";
import { useLocalSearchParams } from "expo-router";
export default function ExerciseDetailRoute() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  return <ExerciseDetailScreen exerciseId={exerciseId ?? ""} />;
}
