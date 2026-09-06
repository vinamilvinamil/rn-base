// app/(main)/products/index.tsx
import { ProductListScreen } from "@/features/products/presentation/screens/ProductListScreen";
import { StyleSheet } from "react-native";

export const ProductListRoute = () => {
    return (
        <ProductListScreen/>
    );
};

export default ProductListRoute;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    formContainer: {
        width: '100%',
    },
});