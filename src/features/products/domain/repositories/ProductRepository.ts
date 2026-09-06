import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { ProductPagination } from "../entities/ProductPagination";
import { ShippingMethod } from "../entities/ShippingMethod";

export interface UpdateProductInput {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    shippingMethodId: string;
    isActive: boolean;
    variants: {
        id?: string;
        options?: Record<string, string>;
        stock: number;
        price?: number;
    }[];
}

export interface ProductQuery {
    page: number;
    limit: number;
    search?: string;
}

export interface ProductRepository {
    getProducts(
        query: ProductQuery,
    ): Promise<ProductPagination>;

    getProductDetail(productId: string): Promise<Product>;

    getCategories(): Promise<Category[]>;

    getShippingMethods(): Promise<ShippingMethod[]>;

    updateProduct(input: UpdateProductInput): Promise<Product>;
}