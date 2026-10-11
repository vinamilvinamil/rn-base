import { EyeCareOverlay } from "@/src/infrastructure/native/EyeCareOverlay";
import { AppButton } from "@/src/shared/components/AppButton";
import { AppCard } from "@/src/shared/components/AppCard";
import { AppHeader } from "@/src/shared/components/AppHeader";
import { AppText } from "@/src/shared/components/AppText";
import { Screen } from "@/src/shared/components/Screen";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { AppState, Platform } from "react-native";

export function BubbleSettingsScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState("");

  const checkPermission = useCallback(async () => {
    if (Platform.OS !== "android") {
      setHasPermission(false);
      setStatus("Floating bubble chỉ được hỗ trợ trên Android.");
      setChecking(false);
      return;
    }

    try {
      setChecking(true);

      const allowed = await EyeCareOverlay.canDrawOverlays();

      setHasPermission(allowed);
      setStatus(
        allowed
          ? "Ứng dụng đã được cấp quyền hiển thị trên ứng dụng khác."
          : "Bạn cần cấp quyền để EyeCare hiển thị bubble trên ứng dụng khác.",
      );
    } catch {
      setHasPermission(false);
      setStatus("Không thể kiểm tra quyền overlay.");
    } finally {
      setChecking(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkPermission();
    }, [checkPermission]),
  );

  // Kiểm tra lại khi người dùng quay về app từ Cài đặt Android.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkPermission();
      }
    });

    return () => subscription.remove();
  }, [checkPermission]);

  const requestPermission = async () => {
    if (Platform.OS !== "android") return;

    try {
      await EyeCareOverlay.openOverlaySettings();
      setStatus("Hãy bật quyền overlay trong Cài đặt Android.");
    } catch {
      setStatus("Không thể mở Cài đặt quyền overlay.");
    }
  };

  return (
    <Screen>
      <AppHeader title="Floating bubble" />

      <AppCard>
        <AppText variant="heading">Quyền hiển thị bubble</AppText>

        <AppText>
          Quyền này cho phép EyeCare hiển thị cửa sổ nhắc nghỉ trên các ứng dụng
          khác. Việc bật, tắt và cấu hình nhắc nhở được quản lý tại màn hình
          Reminder List.
        </AppText>

        {checking ? (
          <AppText>Đang kiểm tra quyền...</AppText>
        ) : (
          <>
            <AppText>
              Trạng thái: {hasPermission ? "Đã cấp quyền" : "Chưa cấp quyền"}
            </AppText>

            <AppText>{status}</AppText>

            {!hasPermission && Platform.OS === "android" && (
              <AppButton title="Kích hoạt quyền" onPress={requestPermission} />
            )}

            <AppButton
              title="Kiểm tra lại quyền"
              variant="secondary"
              onPress={checkPermission}
            />
          </>
        )}
      </AppCard>
    </Screen>
  );
}
