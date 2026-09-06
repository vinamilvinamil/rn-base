import { useQuery } from '@tanstack/react-query';

import { productRepository } from '../../data/repositories/ProductRepositoryImpl';

export const useShippingMethods =
  () => {
    return useQuery({
      queryKey: [
        'master-data',
        'shipping-methods',
      ],

      queryFn: () =>
        productRepository.getShippingMethods(),

      staleTime:
        1000 * 60 * 30,
    });
  };