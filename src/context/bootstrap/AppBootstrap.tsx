// src/application/bootstrap/AppBootstrap.tsx

import { useEffect, useState, type PropsWithChildren } from "react";
import { ActivityIndicator, View } from "react-native";

import { initializeApp } from "./initializeApp";

export function AppBootstrap({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    initializeApp()
      .then(() => {
        if (mounted) setReady(true);
      })
      .catch((err: unknown) => {
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    console.error("[EyeCare] Initialization failed:", error);

    // Không render app như thể khởi tạo đã thành công.
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
