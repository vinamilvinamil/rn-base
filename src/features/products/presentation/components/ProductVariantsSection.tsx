import { NumberInput } from "@/shared/components/NumberInput";
import { Control, Controller, useFieldArray } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { CategoryVariantOption } from "../../domain/entities/Category";
import { ProductForm as ProductFormValues } from "../validation/productSchema";

interface ProductVariantsSectionProps {
  control: Control<ProductFormValues>;
  variantOptions: CategoryVariantOption[];
  loading: boolean;
}

export const ProductVariantsSection = ({
  control,
  variantOptions,
  loading,
}: ProductVariantsSectionProps) => {
  const {
    fields,
  } = useFieldArray({
    control,
    name: 'variants',
  });

  return (
    <View style={styles.variantContainer}>
      <Text style={styles.sectionTitle}>
        Variants
      </Text>

      {fields.map((field, index) => (
        <View
          key={field.id}
          style={styles.variantRow}>
          <View style={styles.variantOptions}>
            {variantOptions.map(option => (
              <Text
                key={option.key}
                style={styles.variantLabel}>
                {option.name}:{' '}
                {field.options[option.key]}
              </Text>
            ))}
          </View>

          <Controller
            control={control}
            name={`variants.${index}.stock`}
            render={({
              field: stockField,
              fieldState,
            }) => (
              <NumberInput
                label="Stock"
                value={stockField.value}
                onChange={stockField.onChange}
                error={
                  fieldState.error?.message
                }
                disabled={loading}
              />
            )}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  variantContainer: {
    marginTop: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },

  sectionTitle: {
    marginBottom: 16,
    fontSize: 16,
    fontWeight: '600',
  },

  variantRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  variantOptions: {
    marginBottom: 12,
  },

  variantLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
});