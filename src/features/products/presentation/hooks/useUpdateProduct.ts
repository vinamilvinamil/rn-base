import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

import { productRepository } from '../../data/repositories/ProductRepositoryImpl';

import {
    UpdateProductInput,
} from '../../domain/repositories/ProductRepository';

export const useUpdateProduct = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: UpdateProductInput,
    ) =>
      productRepository.updateProduct(
        input,
      ),

    onSuccess: updatedProduct => {
      queryClient.setQueryData(
        [
          'product',
          updatedProduct.id,
        ],
        updatedProduct,
      );

      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },
  });
};