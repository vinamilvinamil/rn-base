import { ActivityIndicator, Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn = () => {
    if (isDisabled) return;

    scale.value = withSpring(0.97, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      className={`
        min-h-12
        items-center
        justify-center
        rounded-lg
        bg-primary
        px-5
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-80' : ''}
      `}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text className="text-base font-semibold text-white">
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
};

// const styles = StyleSheet.create({
//   button: {
//     minHeight: 48,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#2563EB',
//   },

//   fullWidth: {
//     width: '100%',
//   },

//   disabled: {
//     opacity: 0.6,
//   },

//   text: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
// });