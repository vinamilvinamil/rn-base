import { ProductPagination } from '../../domain/entities/ProductPagination';
import {
    ProductQuery,
    ProductRepository,
    UpdateProductInput,
} from '../../domain/repositories/ProductRepository';


import { mockCategories, mockProductDetail, mockProducts, mockShippingMethods } from '../mock/productMockData';

export class MockProductRepositoryImpl
    implements ProductRepository {

    async getProducts({
        page,
        limit,
        search,
    }: ProductQuery): Promise<ProductPagination> {
        await new Promise(resolve =>
            setTimeout(resolve, 800),
        );

        let products = [...mockProducts];

        if (search) {
            const keyword =
                search.trim().toLowerCase();

            products = products.filter(product =>
                product.name
                    .toLowerCase()
                    .includes(keyword),
            );
        }

        const total = products.length;

        const totalPages = Math.ceil(
            total / limit,
        );

        const start =
            (page - 1) * limit;

        const end = start + limit;

        const data = products.slice(
            start,
            end,
        );

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }

    async getProductDetail(
        productId: string,
    ) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const product = mockProducts.find(p => p.id == productId);
        return product!;
    }

    async getCategories() {
        await new Promise(resolve => setTimeout(resolve, 200));
        return mockCategories;
    }

    async getShippingMethods() {
        await new Promise(resolve => setTimeout(resolve, 200));
        return mockShippingMethods;
    }

    async updateProduct(
        input: UpdateProductInput,
    ) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const productUpdated = {
            ...mockProductDetail,
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
        }
        return productUpdated;
    }
}