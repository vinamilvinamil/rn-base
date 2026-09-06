import { BaseHeader } from "@/shared/components/Header";
import { useModal } from "@/shared/modal";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ProductEditSkeleton } from "../components/ProductEditSkeleton";
import { ProductEditForm } from "../components/ProductForm";
import { useCategories } from "../hooks/useCategories";
import { useProductDetail } from "../hooks/useProductDetail";
import { useShippingMethods } from "../hooks/useShippingMethods";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { ProductForm as ProductFormValues } from "../validation/productSchema";

export const ProductEditScreen = ({ productId }: { productId: string }) => {
    const { t } = useTranslation();
    // Đây chính là resultModalRef
    // const resultModalRef = useRef<ResultModalRef>(null);
    const { showResult } = useModal();

    const productQuery =
        useProductDetail(productId);

    const categoriesQuery =
        useCategories();

    const shippingQuery =
        useShippingMethods();

    const updateProduct =
        useUpdateProduct();

    const isInitialLoading =
        productQuery.isFetching ||
        categoriesQuery.isLoading ||
        shippingQuery.isLoading;

    const hasInitialError =
        productQuery.isError ||
        categoriesQuery.isError ||
        shippingQuery.isError;

    if (isInitialLoading) {
        return <ProductEditSkeleton />;
    }
    const product = productQuery.data!;

    const categories =
        categoriesQuery.data;

    const shippingMethods =
        shippingQuery.data?.map(method => ({
            label: method.name,
            value: method.id,
        }));

    const initialValues: ProductFormValues = {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        shippingMethodId:
            product.shippingMethodId,
        isActive: product.isActive,
        variants: product.variants.map(
            variant => ({
                id: variant.id,
                options: variant.options,
                stock: variant.stock,
                price: variant.price,
            }),
        ),
    };

    const handleSubmit = (
        form: ProductFormValues,
    ) => {
        updateProduct.mutate(
            {
                id: productId,
                name: form.name,
                description: form.description,
                price: Number(form.price),
                categoryId: form.categoryId,
                shippingMethodId:
                    form.shippingMethodId,
                isActive: form.isActive,
                variants: form.variants.map(
                    variant => ({
                        id: variant.id,
                        options: variant.options,
                        stock: variant.stock,
                        price: variant.price,
                    }),
                ),
            },
            {
                onSuccess: () => {
                    showResult({
                        type: 'success',
                        title: t(
                            'product.messages.updateSuccess',
                        ),
                        message: t(
                            'product.messages.updateSuccessDescription',
                        ),
                        onClose: () => {
                            router.back();
                        },
                    });
                },
                onError: (error) => {
                    showResult({
                        type: 'error',
                        title: t(
                            'product.errors.updateFailed',
                        ),
                        message: t(
                            'errors.unknown',
                        )
                    });
                }
            },
        );
    };

    return (
        <>
            <BaseHeader
                title={t('product.edit.title')}
                showBack
                onBack={() => router.back()}
            />
            <View style={styles.container}>

                <View style={styles.formContainer}>
                    <ProductEditForm
                        initialValues={initialValues}
                        categories={categories || []}
                        shippingMethods={shippingMethods || []}
                        onSubmit={handleSubmit}
                        loading={updateProduct.isPending}
                        submitLabel={t('product.form.update')}
                    />
                </View>
                {/* UI của modal nằm ở đây */}
                {/* <ResultModal ref={resultModalRef} /> */}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },

    formContainer: {
        width: '100%',
        flex: 1,
    },
});