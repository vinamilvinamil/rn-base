
export interface ProductDetailDto {
    id: number;
    product_name: string;
    description: string;
    price: number;
    category_id: number;
    shipping_method_id: number;
    is_active: boolean;
    variants: {
        id: string;
        options?: Record<string, string>;
        stock: number;
        price?: number;
    }[];
}

export interface ProductResponseDto {
    id: number;
    name: string;
    description: string;
    price: number;
    category_id: number;
    shipping_method_id: number;
    is_active: boolean;
    variants: {
        id: string;
        options?: Record<string, string>;
        stock: number;
        price?: number;
    }[];
}

export interface ProductListResponseDto {
    data: ProductResponseDto[];

    meta: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface CategoryDto {
    id: number;
    category_name: string;
    variantOptions?: {
        key: string;
        name: string;
        values: string[];
    }[];
}

export interface ShippingMethodDto {
    id: number;
    method_name: string;
}

export interface UpdateProductRequestDto {
    product_name: string;
    description: string;
    price: number;
    category_id: number;
    shipping_method_id: number;
    is_active: boolean;
    variants: {
        id?: string;
        options?: Record<string, string>;
        stock: number;
        price?: number;
    }[];
}