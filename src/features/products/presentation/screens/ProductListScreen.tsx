import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { useDebounce } from '@/shared/hooks/useDebounce';

import { Input } from '@/shared/components/Input';

import { Product } from '@/features/products/domain/entities/Product';

import { BaseHeader } from '@/shared/components/Header';
import { ProductEmptyState } from '../components/ProductEmptyState';
import { ProductItem } from '../components/ProductItem';
import { ProductListSkeleton } from '../components/ProductListSkeleton';
import { useProducts } from '../hooks/useProducts';

export const ProductListScreen = () => {
  const router = useRouter();

  const [search, setSearch] = useState('');

  /**
   * Chỉ gọi API sau khi user
   * ngừng nhập 400ms.
   */
  const debouncedSearch =
    useDebounce(search, 400);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useProducts(debouncedSearch);

  /**
   * Flatten tất cả page
   *
   * page 1:
   * [1,2,3]
   *
   * page 2:
   * [4,5,6]
   *
   * =>
   * [1,2,3,4,5,6]
   */
  const products = useMemo(() => {
    return (
      data?.pages.flatMap(
        page => page.data,
      ) ?? []
    );
  }, [data]);

  const handleLoadMore = useCallback(() => {
    if (
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleProductPress = useCallback(
    (product: Product) => {
      router.push({
        pathname:
          '/products/[id]/edit',
        params: {
          id: product.id,
        },
      });
    },
    [router],
  );

  const renderItem = useCallback(
    ({
      item,
    }: {
      item: Product;
    }) => {
      return (
        <ProductItem
          product={item}
          onPress={() =>
            handleProductPress(item)
          }
        />
      );
    },
    [handleProductPress],
  );

  const keyExtractor = useCallback(
    (item: Product) => item.id,
    [],
  );

  return (
    <View style={styles.container}>
      <BaseHeader/>
      <View style={styles.header}>
        <Text className='font-bold text-2xl'>
          Products
        </Text>

        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name..."
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {isLoading ? (
        <ProductListSkeleton />
      ) : (
        <FlatList
          data={products}
          keyExtractor={keyExtractor}
          renderItem={renderItem}

          contentContainerStyle={[
            styles.listContent,
            products.length === 0 &&
              styles.emptyList,
          ]}

          showsVerticalScrollIndicator={false}

          /**
           * Pull to refresh
           */
          refreshControl={
            <RefreshControl
              refreshing={
                isFetching &&
                !isFetchingNextPage
              }
              onRefresh={handleRefresh}
            />
          }

          /**
           * Load next page
           */
          onEndReached={
            handleLoadMore
          }

          onEndReachedThreshold={0.5}

          /**
           * Footer loading
           */
          ListFooterComponent={
            isFetchingNextPage ? (
              <View
                style={
                  styles.footerLoading
                }>
                <ActivityIndicator />
              </View>
            ) : null
          }

          /**
           * Empty state
           */
          ListEmptyComponent={
            <ProductEmptyState
              search={debouncedSearch}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  listContent: {
    paddingTop: 8,
    paddingBottom: 32,
  },

  emptyList: {
    flexGrow: 1,
  },

  footerLoading: {
    paddingVertical: 20,
  },
});