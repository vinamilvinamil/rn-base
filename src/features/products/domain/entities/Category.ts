
export interface CategoryVariantOption {
  key: string;
  name: string;
  values: string[];
}

export interface Category {
  id: string;
  name: string;
  variantOptions?: CategoryVariantOption[];
}