import {
    useInfiniteQuery,
} from '@tanstack/react-query';
import { productRepository } from '../../data/repositories/ProductRepositoryImpl';


const LIMIT = 10;

export const useProducts = (
  search: string,
) => {
  return useInfiniteQuery({
    queryKey: [
      'products',
      {
        search,
      },
    ],

    initialPageParam: 1,

    queryFn: ({
      pageParam,
    }) => {
      const response = productRepository.getProducts({
        page: pageParam,
        limit: LIMIT,
        search: search || undefined,
      });
      return response;
    },

    getNextPageParam: lastPage => {
      const {
        page,
        totalPages,
      } = lastPage.meta;

      if (page >= totalPages) {
        return undefined;
      }

      return page + 1;
    },

    staleTime: 30_000,
  });
};