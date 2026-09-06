import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Product } from '@/features/products/domain/entities/Product';

interface ProductListItemProps {
  product: Product;
  onPress: () => void;
}

export const ProductListItem = ({
  product,
  onPress,
}: ProductListItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        <Text
          style={styles.name}
          numberOfLines={1}
        >
          {product.name}
        </Text>

        <Text
          style={styles.description}
          numberOfLines={2}
        >
          {product.description}
        </Text>

        <Text style={styles.price}>
          ${product.price.toFixed(2)}
        </Text>
      </View>

      <View
        style={[
          styles.status,
          product.isActive
            ? styles.active
            : styles.inactive,
        ]}
      >
        <Text style={styles.statusText}>
          {product.isActive
            ? 'Active'
            : 'Inactive'}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  pressed: {
    opacity: 0.7,
  },

  content: {
    flex: 1,
    gap: 6,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
  },

  description: {
    fontSize: 14,
    color: '#6B7280',
  },

  price: {
    fontSize: 15,
    fontWeight: '600',
  },

  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  active: {
    backgroundColor: '#DCFCE7',
  },

  inactive: {
    backgroundColor: '#F3F4F6',
  },

  statusText: {
    fontSize: 12,
  },
});