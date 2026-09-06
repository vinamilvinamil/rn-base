import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { BaseHeader } from '@/shared/components/Header';
import { KeyboardAvoidingView } from '@/shared/components/KeyboardAvoidingView';
import { FormFieldSkeleton, SkeletonBox } from '@/shared/components/SkeletonBox';


export const ProductEditSkeleton = () => {
    return (
        <>
        <BaseHeader
            showBack
        />
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.form}>
                    {/* Name */}
                    <FormFieldSkeleton />

                    {/* Description */}
                    <FormFieldSkeleton inputHeight={100} />

                    {/* Price */}
                    <FormFieldSkeleton />

                    {/* Category */}
                    <FormFieldSkeleton />

                    {/* Shipping Method */}
                    <FormFieldSkeleton />

                    {/* Variants */}
                    <View style={styles.variants}>
                        <SkeletonBox width={80} height={18} borderRadius={4} />

                        <View style={styles.variantCard}>
                            <SkeletonBox width={60} height={16} borderRadius={4} />

                            <View style={styles.variantRow}>
                                <SkeletonBox width="45%" height={44} />
                                <SkeletonBox width="45%" height={44} />
                            </View>
                        </View>

                        <View style={styles.variantCard}>
                            <SkeletonBox width={60} height={16} borderRadius={4} />

                            <View style={styles.variantRow}>
                                <SkeletonBox width="45%" height={44} />
                                <SkeletonBox width="45%" height={44} />
                            </View>
                        </View>

                        <View style={styles.variantCard}>
                            <SkeletonBox width={60} height={16} borderRadius={4} />

                            <View style={styles.variantRow}>
                                <SkeletonBox width="45%" height={44} />
                                <SkeletonBox width="45%" height={44} />
                            </View>
                        </View>
                    </View>

                    {/* Active */}
                    <View style={styles.activeRow}>
                        <SkeletonBox
                            width={22}
                            height={22}
                            borderRadius={5}
                        />

                        <SkeletonBox
                            width={100}
                            height={16}
                            borderRadius={4}
                        />
                    </View>

                    {/* Submit button */}
                    <SkeletonBox
                        height={48}
                        borderRadius={8}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 24,
        paddingBottom: 40,
    },

    form: {
        gap: 16,
    },

    field: {
        gap: 8,
    },

    variants: {
        gap: 12,
    },

    variantCard: {
        gap: 12,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
    },

    variantRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    activeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
});