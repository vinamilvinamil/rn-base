export interface ProductVariant {
  id: string;
  productId: string;

  /**
   * Variant options.
   *
   * Example:
   * {
   *   size: 'M'
   * }
   *
   * Or:
   * {
   *   size: 'M',
   *   color: 'Black'
   * }
   */
  options: Record<string, string>;

  stock: number;

  /**
   * Optional:
   * variant can have its own price.
   * If undefined, use product.price.
   */
  price?: number;
}