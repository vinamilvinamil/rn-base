import { AppButton } from "@/src/shared/components/AppButton";
import { AppText } from "@/src/shared/components/AppText";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TEAL = "#159D96";
const TEXT = "#172D3A";
const MUTED = "#849198";
const BG = "#F8FAF8";

export function WelcomeScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(0);

  const goNext = () => {
    if (currentPage < 2) {
      setCurrentPage((page) => page + 1);
    } else {
      router.replace("/(tabs)");
    }
  };

  const renderPagination = () => (
    <View style={s.pagination}>
      {[0, 1, 2].map((page) => (
        <Pressable
          key={page}
          accessibilityRole="button"
          accessibilityLabel={`Onboarding ${page + 1}`}
          onPress={() => setCurrentPage(page)}
          hitSlop={8}
          style={[s.dot, currentPage === page && s.activeDot]}
        />
      ))}
    </View>
  );

  const renderOnboarding1 = () => (
    <View style={s.pageWrapper}>
      <View style={s.heading}>
        <AppText style={s.title}>Take care of{"\n"}your eyes</AppText>
        <AppText style={s.subtitle}>
          Your personal eye break companion{"\n"}for a healthier, happier you.
        </AppText>
      </View>
      {/* Đẩy ảnh xuống dưới cùng của phần content */}
      <View style={s.heroArtwork}>
        <Image
          source={require("@/assets/images/eyecare-onboard-1.png")}
          style={s.welcomeImage}
          resizeMode="contain"
          accessibilityLabel="Boy working at laptop with his cat"
        />
      </View>
    </View>
  );

  const renderOnboarding3 = () => {
    const features = [
      {
        renderIcon: (color: string) => (
          <Ionicons name="time-outline" size={32} color={color} />
        ),
        symbol: "◷", // Bạn nên thay bằng Icon thực tế như Lucide / FontAwesome
        title: "Smart Reminders",
        description: "Get notified with a floating bubble and notifications.",
        background: "#EAF3FC",
        foreground: "#4A80C4",
      },
      {
        renderIcon: (color: string) => (
          <MaterialCommunityIcons name="eye-outline" size={32} color={color} />
        ),
        symbol: "◎",
        title: "Eye Exercises",
        description: "Simple and effective exercises to relax your eyes.",
        background: "#E8F7EE",
        foreground: "#11936D",
      },
      {
        renderIcon: (color: string) => (
          <Feather name="trending-up" size={32} color={color} />
        ),
        symbol: "↗",
        title: "Track Progress",
        description: "Build healthy habits and see your improvement.",
        background: "#F2EDFE",
        foreground: "#8463E5",
      },
    ];

    return (
      <View style={s.pageWrapper}>
        {/* Khối chứa features giờ sẽ bao phủ toàn bộ chiều cao trống */}
        <View style={s.featuresContainer}>
          {features.map((feature) => (
            <View key={feature.title} style={s.featureRow}>
              <View
                style={[s.featureIcon, { backgroundColor: feature.background }]}
              >
                {feature.renderIcon(feature.foreground)}
              </View>
              <View style={s.featureInfo}>
                <AppText style={s.featureTitle}>{feature.title}</AppText>
                <AppText style={s.featureDescription}>
                  {feature.description}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderOnboarding2 = () => (
    <View style={s.pageWrapper}>
      {/* Tối ưu tỷ lệ ảnh để không đè chữ */}
      <View style={s.memoryArtwork}>
        <Image
          source={require("@/assets/images/eyecare-onboard-3.png")}
          style={s.memoryImage}
          resizeMode="contain"
          accessibilityLabel="Boy and cat resting in a beautiful mountain valley"
        />
      </View>
      <View style={s.finalHeading}>
        <AppText style={s.finalTitle}>
          Rest your eyes{"\n"}See a brighter tomorrow
        </AppText>
        <AppText style={s.finalSubtitle}>Small breaks. Big difference.</AppText>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.safeArea} edges={["top", "bottom"]}>
      <View style={s.container}>
        <View style={s.content}>
          {currentPage === 0 && renderOnboarding1()}
          {currentPage === 1 && renderOnboarding2()}
          {currentPage === 2 && renderOnboarding3()}
        </View>

        <View style={s.bottomContainer}>
          {renderPagination()}
          <View style={s.footer}>
            <AppButton
              title={
                currentPage === 0
                  ? "Get Started"
                  : currentPage === 1
                    ? "Next"
                    : "Let's Go"
              }
              onPress={goNext}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    paddingHorizontal: 32, // Tăng padding hai bên nhìn sẽ cao cấp và thoáng hơn
  },
  content: {
    flex: 1,
  },
  pageWrapper: {
    flex: 1,
    justifyContent: "space-between", // Đẩy các thành phần đầu/cuối tách biệt tự nhiên
  },
  centerContent: {
    justifyContent: "center", // Dành riêng cho màn hình 2 để căn giữa cụm tính năng
  },

  // Onboarding 1
  heading: {
    alignItems: "center",
    marginTop: 70,
  },
  title: {
    fontSize: 35,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: TEXT,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 22,
    color: MUTED,
    textAlign: "center",
  },
  heroArtwork: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end", // Đặt sát đáy vùng content
    marginBottom: 20,
  },
  welcomeImage: {
    width: "100%",
    height: "90%",
  },

  // Onboarding 2
  featuresContainer: {
    flex: 1, // Chiếm toàn bộ chiều cao của phần content trống
    justifyContent: "space-evenly", // Tự động rải đều khoảng cách giữa 3 item
    paddingVertical: 50, // Tạo khoảng đệm trên dưới giúp icon không bị sát rìa quá
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start", // Đổi từ center thành flex-start để căn icon thẳng hàng với dòng chữ đầu tiên
    gap: 18,
    width: "100%",
  },
  featureIcon: {
    width: 60, // Tăng nhẹ kích thước vòng tròn icon lên một chút cho đẹp
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2, // Đẩy nhẹ icon xuống một xíu để cân bằng với dòng title đầu tiên
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 24, // Tăng font size để chữ nổi bật hơn giống bản design
    lineHeight: 24,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 16,
    lineHeight: 20, // Tăng lineHeight giúp các dòng mô tả thoáng, dễ đọc hơn hẳn
    color: MUTED,
  },

  // Onboarding 3
  memoryArtwork: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  memoryImage: {
    width: "100%",
    height: "100%",
  },
  finalHeading: {
    alignItems: "center",
    marginVertical: 30,
  },
  finalTitle: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: TEXT,
    textAlign: "center",
  },
  finalSubtitle: {
    marginTop: 14,
    fontSize: 16,
    color: MUTED,
    textAlign: "center",
  },

  // Pagination & Bottom Actions
  bottomContainer: {
    paddingBottom: 20,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#DCE4E1",
  },
  activeDot: {
    width: 16,
    backgroundColor: TEAL,
  },
  footer: {
    width: "100%",
  },
  backButtonContainer: {
    height: 30, // Giữ chỗ cố định cho nút Back không làm đẩy layout nút chính lên xuống
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  backText: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "600",
  },
});
