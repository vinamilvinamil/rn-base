import { useQuery } from '@tanstack/react-query';

import { productRepository } from '../../data/repositories/ProductRepositoryImpl';

export const useProductDetail = (
    productId: string,
) => {
    return useQuery({
        queryKey: [
            'product',
            productId,
        ],

        queryFn: () =>
            productRepository.getProductDetail(
                productId,
            ),
        enabled: Boolean(productId),
    });
};