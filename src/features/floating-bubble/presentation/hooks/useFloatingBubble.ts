import { useState } from "react";
import { OverlayRepositoryImpl } from "../../data/repositories/OverlayRepositoryImpl";
import type { BubbleConfig } from "../../domain/entities/BubbleConfig";
const repo = new OverlayRepositoryImpl();
export function useFloatingBubble() {
  const [status, setStatus] = useState("");
  const enable = async (config: BubbleConfig) => {
    try {
      const s = await repo.getStatus();
      if (!s.permissionGranted) {
        setStatus("Cần cấp quyền overlay trong Cài đặt Android.");
        return false;
      }
      await repo.start(config);
      setStatus("Đã yêu cầu bật bubble.");
      return true;
    } catch {
      setStatus(
        "Không thể bật overlay. Hãy kiểm tra development build và native module.",
      );
      return false;
    }
  };

  const update = async (config: BubbleConfig) => {
    try {
      await repo.update(config);
      setStatus("Đã cập nhật lịch nhắc.");
      return true;
    } catch (error) {
      console.error("Update overlay failed:", error);
      setStatus("Không thể cập nhật lịch nhắc.");
      return false;
    }
  };

  const disable = async () => {
    try {
      await repo.stop();
      setStatus("Đã tắt bubble.");
    } catch {
      setStatus("Không thể tắt bubble.");
    }
  };
  return { status, enable, update, disable };
}
