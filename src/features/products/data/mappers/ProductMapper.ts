
import { Category } from '../../domain/entities/Category';
import { Product } from '../../domain/entities/Product';
import { ProductPagination } from '../../domain/entities/ProductPagination';
import { ShippingMethod } from '../../domain/entities/ShippingMethod';

import {
    CategoryDto,
    ProductDetailDto,
    ProductListResponseDto,
    ProductResponseDto,
    ShippingMethodDto,
} from '../dto/ProductDto';

export const ProductMapper = {
    toDomain(
        dto: ProductResponseDto,
    ): Product {
        return {
            id: String(dto.id),

            name: dto.name,

            description:
                dto.description,

            price: dto.price,

            categoryId:
                String(dto.category_id),

            shippingMethodId:
                String(
                    dto.shipping_method_id,
                ),

            isActive:
                dto.is_active,

            variants:
                dto.variants.map(
                    variant => ({
                        id: String(
                            variant.id,
                        ),
                        productId:
                            String(dto.id),
                        options:
                            variant.options ?? {},
                        stock:
                            variant.stock,
                        price:
                            variant.price,
                    }),
                ),
        };
    },

    toPagination(
        dto: ProductListResponseDto,
    ): ProductPagination {
        return {
            data: dto.data.map(
                ProductMapper.toDomain,
            ),

            meta: {
                page: dto.meta.page,

                limit:
                    dto.meta.limit,

                total:
                    dto.meta.total,

                totalPages:
                    dto.meta.total_pages,
            },
        };
    },
    toProduct(
        dto: ProductDetailDto,
    ): Product {
        return {
            id: String(dto.id),
            name: dto.product_name,
            description: dto.description,
            price: dto.price,
            categoryId: String(
                dto.category_id,
            ),
            shippingMethodId: String(
                dto.shipping_method_id,
            ),
            isActive: dto.is_active,
            variants: dto.variants.map(variant => ({
                id: String(variant.id),
                productId: String(dto.id),
                options: variant.options || {},
                stock: variant.stock,
                price: variant.price,
            })),
        };
    },

    toCategory(
        dto: CategoryDto,
    ): Category {
        return {
            id: String(dto.id),
            name: dto.category_name,
            variantOptions: dto.variantOptions?.map(option => ({
                key: option.key,
                name: option.name,
                values: option.values,
            })),
        };
    },

    toShippingMethod(
        dto: ShippingMethodDto,
    ): ShippingMethod {
        return {
            id: String(dto.id),
            name: dto.method_name,
        };
    },
};