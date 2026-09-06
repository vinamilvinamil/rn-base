import { MOCK_ENABLE } from '@/shared/constants/Constants';
import {
    ProductQuery,
    ProductRepository,
    UpdateProductInput,
} from '../../domain/repositories/ProductRepository';

import { productApi } from '../api/productApi';

import { ProductPagination } from '../../domain/entities/ProductPagination';
import { ProductMapper } from '../mappers/ProductMapper';
import { MockProductRepositoryImpl } from './MockProductRepositoryImpl';

export class ProductRepositoryImpl
    implements ProductRepository {
    async getProducts({
        page,
        limit,
        search,
    }: ProductQuery): Promise<ProductPagination> {
        const response =
      await productApi.getProducts({
        page: page,
        limit: limit,
        search: search,
      });

    return ProductMapper.toPagination(
      response,
    );

    }
    async getProductDetail(
        productId: string,
    ) {
        const response =
            await productApi.getDetail(
                productId,
            );

        return ProductMapper.toProduct(
            response,
        );
    }

    async getCategories() {
        const response =
            await productApi.getCategories();

        return response.map(
            ProductMapper.toCategory,
        );
    }

    async getShippingMethods() {
        const response =
            await productApi.getShippingMethods();

        return response.map(
            ProductMapper.toShippingMethod,
        );
    }

    async updateProduct(
        input: UpdateProductInput,
    ) {
        const response =
            await productApi.update(
                input.id,
                {
                    product_name: input.name,
                    description:
                        input.description,
                    price: input.price,
                    category_id:
                        Number(input.categoryId),
                    shipping_method_id:
                        Number(
                            input.shippingMethodId,
                        ),
                    is_active: input.isActive,
                    variants: input.variants.map(
                        variant => ({
                            id: variant.id,
                            options:
                                variant.options,
                            stock: variant.stock,
                            price: variant.price,
                        }),
                    ),
                },
            );

        return ProductMapper.toProduct(
            response,
        );
    }
}

export const productRepository = MOCK_ENABLE ? new MockProductRepositoryImpl() :
    new ProductRepositoryImpl();