import { z } from 'zod';

export const productVariantSchema = z.object({
  id: z.string().optional(),

  options: z.record(
    z.string(),
    z.string().min(1),
  ),

  stock: z
    .number({
      message: 'Stock is required',
    })
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),

  price: z
    .number()
    .positive('Price must be greater than 0')
    .optional(),
});

export const productSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        'Tên sản phẩm không được để trống',
      ),

    description: z
      .string()
      .trim()
      .min(
        1,
        'Mô tả không được để trống',
      ),

    price: z
    .number()
    .min(0, 'Giá phải lớn hơn 0'),
    categoryId: z
      .string()
      .min(
        1,
        'Vui lòng chọn category',
      ),

    shippingMethodId: z
      .string()
      .min(
        1,
        'Vui lòng chọn phương thức vận chuyển',
      ),

    isActive: z.boolean(),
    variants: z.array(productVariantSchema),
  });

export type ProductForm =
  z.infer<typeof productSchema>;