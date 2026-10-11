import { getOnboardingCompleted } from "@/src/features/onboarding/data/repositories/OnboardingRepositoryImpl";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function IndexRoute() {
  const [destination, setDestination] = useState<"onboarding" | "home" | null>(
    null,
  );
  useEffect(() => {
    getOnboardingCompleted().then((done) =>
      setDestination(done ? "home" : "onboarding"),
    );
  }, []);
  if (!destination)
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  return (
    <Redirect
      href={destination === "home" ? "/(tabs)" : "/(onboarding)/welcome"}
    />
  );
}
