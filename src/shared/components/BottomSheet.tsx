import React, { forwardRef, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView
} from '@gorhom/bottom-sheet';

export interface BottomSheetRef {
    present: () => void;
    dismiss: () => void;
}

interface BottomSheetProps {
    title?: string;
    children: React.ReactNode;
    supportScroll?: boolean; // dungf cho scroll  view inside
    snapPoints?: string[];
}

export const BottomSheet = forwardRef<
    BottomSheetRef,
    BottomSheetProps
>(({ title, children, snapPoints = ['50%'], supportScroll = false }, ref) => {
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);

    React.useImperativeHandle(ref, () => ({
        present: () => {
            bottomSheetRef.current?.present();
        },

        dismiss: () => {
            bottomSheetRef.current?.dismiss();
        },
    }));

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.5}
            />
        ),
        [],
    );

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            enableDynamicSizing={false}
            backgroundStyle={styles.background}
            handleIndicatorStyle={styles.handle}>
            {/*  */}
            {
                supportScroll ?
                    <View style={styles.container}>
                        {title && (
                            <View style={styles.header}>
                                <Text style={styles.title}>
                                    {title}
                                </Text>
                            </View>
                        )}
                        {children}
                    </View> :
                    <BottomSheetView style={styles.container}>
                        {title && (
                            <View style={styles.header}>
                                <Text style={styles.title}>
                                    {title}
                                </Text>
                            </View>
                        )}

                        {children}
                    </BottomSheetView>
            }

        </BottomSheetModal>
    );
});

BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
    },

    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20
    },

    header: {
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E7EB',
    },

    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
});