import {
    memo,
} from 'react';

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Product } from '../../domain/entities/Product';

interface ProductItemProps {
  product: Product;
  onPress: () => void;
}

export const ProductItem = memo(
  ({
    product,
    onPress,
  }: ProductItemProps) => {
    return (
      <Pressable
        style={styles.container}
        onPress={onPress}>
        <View style={styles.content}>
          <Text
            style={styles.name}
            numberOfLines={1}>
            {product.name}
          </Text>

          <Text
            style={styles.description}
            numberOfLines={2}>
            {product.description}
          </Text>

          <View
            style={styles.bottomRow}>
            <Text style={styles.price}>
              {product.price.toLocaleString(
                'vi-VN',
              )}{' '}
              ₫
            </Text>

            <Text
              style={[
                styles.status,
                product.isActive
                  ? styles.active
                  : styles.inactive,
              ]}>
              {product.isActive
                ? 'Active'
                : 'Inactive'}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  content: {
    gap: 6,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
  },

  description: {
    fontSize: 14,
    color: '#666',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  price: {
    fontSize: 15,
    fontWeight: '600',
  },

  status: {
    fontSize: 12,
    fontWeight: '500',
  },

  active: {
    color: 'green',
  },

  inactive: {
    color: '#999',
  },
});