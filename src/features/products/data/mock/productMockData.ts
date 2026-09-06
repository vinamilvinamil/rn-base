import { Category } from "../../domain/entities/Category";
import { Product } from "../../domain/entities/Product";
import { ShippingMethod } from "../../domain/entities/ShippingMethod";

export const mockProductDetail: Product = {
    id: "1",
    name: "Mock Product",
    description: "This is a mock product for testing purposes.",
    price: 99.99,
    categoryId: "1",
    shippingMethodId: "1",
    isActive: true,
    variants: [
        {
            id: 'variant-1',
            productId: '1',
            options: {
                size: 'S',
            },
            stock: 10,
        },
        {
            id: 'variant-2',
            productId: '1',
            options: {
                size: 'M',
            },
            stock: 20,
        },
        {
            id: 'variant-3',
            productId: '1',
            options: {
                size: 'L',
            },
            stock: 15,
        },
        {
            id: 'variant-4',
            productId: '1',
            options: {
                size: 'XL',
            },
            stock: 8,
        },
        {
            id: 'variant-5',
            productId: '1',
            options: {
                size: 'XXL',
            },
            stock: 5,
        },
    ],
}
let count = 1;
export const mockProducts: Product[] = [
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},
    {...mockProductDetail, id: count + '', name: mockProductDetail.name + count++},

]

export const mockCategories: Category[] = [
    {
        id: "1",
        name: "Food & Beverages"
    },
    {
        id: "2",
        name: "Electronics"
    },
    {
        id: "3",
        name: "Clothing",
        variantOptions: [
            {
                key: 'size',
                name: 'Size',
                values: ['S', 'M', 'L', 'XL', 'XXL'],
            },
        ],
    },
];

export const mockShippingMethods: ShippingMethod[] = [
    {
        id: "1",
        name: "Standard Shipping"
    },
    {
        id: "2",
        name: "Express Shipping"
    },
    {
        id: "3",
        name: "Overnight Shipping"
    },
];