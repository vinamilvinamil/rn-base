import { useQuery } from '@tanstack/react-query';

import { productRepository } from '../../data/repositories/ProductRepositoryImpl';

export const useCategories = () => {
  return useQuery({
    queryKey: ['master-data', 'categories'],

    queryFn: () =>
      productRepository.getCategories(),

    staleTime:
      1000 * 60 * 30,
  });
};