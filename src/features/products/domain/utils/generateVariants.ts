import {
    CategoryVariantOption,
} from '../../domain/entities/Category';
import { ProductForm } from '../../presentation/validation/productSchema';


type ProductVariantForm =
  ProductForm['variants'][number];

export const generateVariants = (
  options: CategoryVariantOption[],
  existingVariants: ProductVariantForm[],
): ProductVariantForm[] => {
  if (options.length === 0) {
    return [];
  }

  const combinations =
    generateCombinations(options);

  return combinations.map(combination => {
    const existingVariant =
      existingVariants.find(variant =>
        isSameOptions(
          variant.options,
          combination,
        ),
      );

    if (existingVariant) {
      return existingVariant;
    }

    return {
      id: undefined,
      options: combination,
      stock: 0,
    };
  });
};

const generateCombinations = (
  options: CategoryVariantOption[],
): Record<string, string>[] => {
  let result: Record<string, string>[] = [
    {},
  ];

  for (const option of options) {
    const next: Record<string, string>[] = [];

    for (const current of result) {
      for (const value of option.values) {
        next.push({
          ...current,
          [option.key]: value,
        });
      }
    }

    result = next;
  }

  return result;
};

const isSameOptions = (
  a: Record<string, string>,
  b: Record<string, string>,
): boolean => {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  return aKeys.every(
    key => a[key] === b[key],
  );
};