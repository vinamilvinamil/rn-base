
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/shared/components/Button';
import { Checkbox } from '@/shared/components/Checkbox';
import { Input } from '@/shared/components/Input';
import { NumberInput } from '@/shared/components/NumberInput';
import { Select, SelectOption } from '@/shared/components/Select';

import { KeyboardAvoidingView } from '@/shared/components/KeyboardAvoidingView';
import { Category } from '../../domain/entities/Category';
import { generateVariants } from '../../domain/utils/generateVariants';
import {
    productSchema,
    type ProductForm as ProductFormValues,
} from '../validation/productSchema';
import { ProductVariantsSection } from './ProductVariantsSection';

interface ProductVariantOption {
    key: string;
    name: string;
    values: string[];
}

export interface ProductEditFormProps {
    initialValues?: ProductFormValues;
    categories: Category[];
    shippingMethods: SelectOption<string>[];
    loading?: boolean;
    submitLabel?: string;
    onSubmit: (values: ProductFormValues) => void | Promise<void>;
}

export const ProductEditForm = ({
    initialValues,
    categories,
    shippingMethods,
    loading = false,
    submitLabel,
    onSubmit,
}: ProductEditFormProps) => {
    const { t } = useTranslation();
    const schema = React.useMemo(
        () => productSchema,
        [t],
    );

    const {
        control,
        watch,
        setValue,
        handleSubmit,
    } = useForm<ProductFormValues>({
        resolver: zodResolver(schema),
        defaultValues:
            initialValues ?? {
                name: '',
                description: '',
                price: undefined,
                categoryId: '',
                shippingMethodId: '',
                isActive: true,
                variants: []
            },
    });

    /**
     * Current selected category.
     *
     * This is important:
     * Do NOT use product.categoryId here.
     */
    const categoryId = watch('categoryId');

    const variants = watch('variants');

    const selectedCategory = useMemo(() => {
        return categories.find(
            category => category.id === categoryId,
        );
    }, [categories, categoryId]);
    const variantOptions =
        selectedCategory?.variantOptions ?? [];
    useEffect(() => {
        if (!categoryId) {
            setValue('variants', []);
            return;
        }

        if (variantOptions.length === 0) {
            setValue('variants', []);
            return;
        }

        /**
         * Preserve existing variants whenever possible.
         */
        const newVariants = generateVariants(
            variantOptions,
            variants,
        );

        setValue('variants', newVariants);
    }, [
        categoryId,
        variantOptions,
        setValue,
    ]);

    /**
 * Category options for Select.
 */
    const categoryOptions: SelectOption<string>[] =
        categories.map(category => ({
            label: category.name,
            value: category.id,
        }));


    return (
        <KeyboardAvoidingView
            style={styles.viewcontainer}
        >
            <ScrollView
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <View style={styles.form}>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <Input
                                label={t('product.form.name')}
                                value={field.value}
                                onChangeText={field.onChange}
                                onBlur={field.onBlur}
                                error={fieldState.error?.message}
                                placeholder={t('product.form.namePlaceholder')}
                                editable={!loading}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="description"
                        render={({ field, fieldState }) => (
                            <Input
                                label={t('product.form.description')}
                                value={field.value}
                                onChangeText={field.onChange}
                                onBlur={field.onBlur}
                                error={fieldState.error?.message}
                                placeholder={t(
                                    'product.form.descriptionPlaceholder',
                                )}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                editable={!loading}
                                style={styles.descriptionInput}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="categoryId"
                        render={({ field, fieldState }) => (
                            <Select
                                label={t('product.form.category')}
                                placeholder={t(
                                    'product.form.categoryPlaceholder',
                                )}
                                value={field.value}
                                options={categoryOptions}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                                disabled={loading}
                                enableSearch
                                bottomSheetTitle={t(
                                    'product.form.category',
                                )}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="shippingMethodId"
                        render={({ field, fieldState }) => (
                            <Select
                                label={t('product.form.shippingMethod')}
                                placeholder={t(
                                    'product.form.shippingMethodPlaceholder',
                                )}
                                value={field.value}
                                options={shippingMethods}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                                disabled={loading}
                                bottomSheetTitle={t(
                                    'product.form.shippingMethod',
                                )}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="price"
                        render={({ field, fieldState }) => (
                            <NumberInput
                                label={t('product.form.price')}
                                value={field.value}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                                placeholder="0"
                                disabled={loading}
                            />
                        )}
                    />

                    {/* Variants */}
                    {variantOptions.length > 0 && (
                        <ProductVariantsSection
                            control={control}
                            variantOptions={variantOptions}
                            loading={loading}
                        />
                    )}


                    <Controller
                        control={control}
                        name="isActive"
                        render={({ field }) => (
                            <Checkbox
                                label={t('product.form.isActive')}
                                value={field.value}
                                onChange={field.onChange}
                                disabled={loading}
                            />
                        )}
                    />

                    <View style={styles.submitContainer}>
                        <Button
                            title={
                                submitLabel ??
                                t('product.form.submit')
                            }
                            onPress={handleSubmit(onSubmit)}
                            loading={loading}
                            disabled={loading}
                            fullWidth
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    viewcontainer: {
        flex: 1,
    },

    contentContainer: {
        flexGrow: 1,
    },

    form: {
    },

    row: {
        flexDirection: 'row',
        gap: 12,
    },

    half: {
        flex: 1,
    },

    descriptionInput: {
        minHeight: 100,
        paddingTop: 12,
    },

    submitContainer: {
        marginTop: 8,
    },
});