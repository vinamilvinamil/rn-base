import { AppProviders } from "@/src/context/providers/AppProviders";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import "../global.css";

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F5F8F7" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="break/index" options={{ presentation: "modal" }} />
        <Stack.Screen
          name="break/complete"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen name="exercises/[exerciseId]" />
        <Stack.Screen name="goals/index" />
        <Stack.Screen name="goals/achievements" />
        <Stack.Screen name="reminders/index" />
        <Stack.Screen name="reminders/edit/[ruleId]" />
        <Stack.Screen name="settings/appearance" />
        <Stack.Screen name="settings/bubble" />
        <Stack.Screen name="settings/notifications" />
        <Stack.Screen name="settings/permissions" />
        <Stack.Screen name="settings/about" />
      </Stack>
    </AppProviders>
  );
}
