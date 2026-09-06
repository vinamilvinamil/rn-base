import { useColors } from '@/shared/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import {
    Pressable,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface HeaderAction {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

interface BaseHeaderProps {
  title?: string;

  showBack?: boolean;
  onBack?: () => void;

  rightAction?: HeaderAction;
  rightActions?: HeaderAction[];

  leftAction?: HeaderAction;

  transparent?: boolean;
}

export const BaseHeader = ({
  title,
  showBack = false,
  onBack,

  rightAction,
  rightActions,

  leftAction,

  transparent = true,
}: BaseHeaderProps) => {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const actions =
    rightActions ??
    (rightAction ? [rightAction] : []);

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: transparent
          ? 'transparent'
          : colors.background,
      }}
      className="w-full">
      <View className="h-14 flex-row items-center px-4">
        {/* LEFT */}
        <View className="w-12 flex-row items-center">
          {showBack ? (
            <Pressable
              onPress={onBack}
              disabled={!onBack}
              hitSlop={8}
              className="h-10 w-10 items-center justify-center rounded-full active:bg-background-element">
              <Ionicons
                name="arrow-back"
                size={22}
                color={colors.text}
              />
            </Pressable>
          ) : leftAction ? (
            <Pressable
              onPress={leftAction.onPress}
              disabled={leftAction.disabled}
              hitSlop={8}
              accessibilityLabel={
                leftAction.accessibilityLabel
              }
              className="h-10 w-10 items-center justify-center rounded-full active:bg-background-element">
              <Ionicons
                name={leftAction.icon}
                size={22}
                color={
                  leftAction.disabled
                    ? colors.textDisabled
                    : colors.text
                }
              />
            </Pressable>
          ) : null}
        </View>

        {/* TITLE */}
        <View className="flex-1 items-center justify-center px-2">
          {title ? (
            <Text
              numberOfLines={1}
              className="text-lg font-semibold text-text">
              {title}
            </Text>
          ) : null}
        </View>

        {/* RIGHT */}
        <View className="w-12 flex-row items-center justify-end">
          {actions.length > 0 ? (
            <View className="flex-row items-center gap-1">
              {actions.map((action, index) => (
                <Pressable
                  key={`${action.icon}-${index}`}
                  onPress={action.onPress}
                  disabled={action.disabled}
                  hitSlop={8}
                  accessibilityLabel={
                    action.accessibilityLabel
                  }
                  className="h-10 w-10 items-center justify-center rounded-full active:bg-background-element">
                  <Ionicons
                    name={action.icon}
                    size={22}
                    color={
                      action.disabled
                        ? colors.textDisabled
                        : colors.text
                    }
                  />
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};