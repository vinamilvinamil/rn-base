import {
    StyleSheet,
    View
} from 'react-native';

export const SkeletonBox = ({
  width = '100%',
  height = 48,
  borderRadius = 8,
}: {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
}) => {
  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
      ]}
    />
  );
};

export const FormFieldSkeleton = ({
  inputHeight = 48,
}: {
  inputHeight?: number;
}) => {
  return (
    <View style={styles.field}>
      <SkeletonBox width={100} height={16} borderRadius={4} />
      <SkeletonBox height={inputHeight} />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
  },
  field: {
    gap: 8,
  },
});