import { ProductVariant } from "./ProductVariant";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    shippingMethodId: string;
    isActive: boolean;
    variants: ProductVariant[];
}