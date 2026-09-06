import { SkeletonBox } from '@/shared/components/SkeletonBox';

import {
    StyleSheet,
    View,
} from 'react-native';


export const ProductListSkeleton = () => {
  return (
    <View>
      {Array.from({length: 8}).map(
        (_, index) => (
          <View
            key={index}
            style={styles.item}>
            <SkeletonBox
              width="70%"
              height={18}
            />

            <SkeletonBox
              width="100%"
              height={14}
            />

            <SkeletonBox
              width="30%"
              height={16}
            />
          </View>
        ),
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    gap: 8,
  },
});