import { Platform } from "react-native";
export const cardShadow = Platform.select({
  ios: {
    shadowColor: "#14332E",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  android: { elevation: 2 },
});
