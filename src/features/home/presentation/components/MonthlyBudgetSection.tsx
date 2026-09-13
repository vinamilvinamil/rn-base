import { Budget } from '@/features/budget/domain/models/budget';
import { useUpsertBudget } from '@/features/budget/presentation/hooks/useBudgetMutation';
import { BottomSheet, BottomSheetRef } from '@/shared/components/BottomSheet';
import { COLORS } from '@/shared/constants/theme';
import { formatPrice } from '@/shared/util/utils';
import { Feather } from '@expo/vector-icons';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export interface MonthlyBudgetSectionProps {
    budget: Budget | null;
    monthExpense: number;
    currency: string;
}
export default function MonthlyBudgetSection({
    budget,
    monthExpense,
    currency,
}: MonthlyBudgetSectionProps) {
    const bottomSheetRef = useRef<BottomSheetRef>(null);
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    
    const {mutateAsync: upsertBudget, isPending: saving} = useUpsertBudget();
    
    useEffect(() => {
        setAmount(budget ? String(budget.amount) : "");
        setError("");
    }, [budget])

    const handleSave = async () => {
        const pasedAmount = parseFloat(amount.replace(/,/g, ""));
        if(!pasedAmount || pasedAmount <= 0) {
            setError("Enter a valid monthly budget");
            return;
        }
        try {
            await upsertBudget(pasedAmount);
            bottomSheetRef.current?.dismiss();
        }catch(err) {
            console.error("Error saving budget", err);
            setError("something went wrong!");
        }
    }
    return (
        <>

            <TouchableOpacity
                onPress={() => { }}
                activeOpacity={0.85}
                className='bg-white rounded-[18px] border border-[#E8E6DF] p-5 mb-[18px]'
            >
                <View className='flex-row items-center justify-between mb-2.5'>
                    <Text className='text-[#1A1D26] text-sm font-medium'>
                        Monthly budget
                    </Text>
                    <TouchableOpacity
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        onPress={() => bottomSheetRef.current?.present()}>
                        <Feather name='edit-2' size={13} color={'#8A8D96'} />
                    </TouchableOpacity>
                </View>
                {
                    budget ? (
                        <>
                            <Text className='text-brand-text-secondary text-xs mb-2'>
                                {formatPrice(monthExpense, currency)} of {" "}
                                {formatPrice(budget.amount, currency)} spent
                            </Text>
                            <View className='h-2 rounded-full bg-[#F0EEE7] overflow-hidden'>
                                <View className='h-2 rounded-full'
                                    style={{
                                        width: `${Math.min(
                                            Math.round((monthExpense / budget.amount) * 100), 100
                                        )}%`,
                                        backgroundColor:
                                            monthExpense >= budget.amount
                                                ? '#FF6B4A'
                                                : monthExpense >= budget.amount * 0.8
                                                    ? '#F7DC6F'
                                                    : '#3DDC84'
                                    }}
                                />
                            </View>
                        </>
                    ) : (
                        <Text className='text-brand-text-secondary text-xs'>
                            Tap to set a monthly speding budget
                        </Text>
                    )
                }
            </TouchableOpacity>
            <BottomSheet
                ref={bottomSheetRef}
                backgroundColor='#F5F4F0'
                title={budget ? 'Edit monthly budget' : 'Set monthly budget'}>
                <View style={styles.container}>
                    <Text style={styles.label}>Monthly budget</Text>
                    <View style={[
                        styles.inputContainer,
                        error && styles.inputError,
                    ]}>
                        <BottomSheetTextInput
                            value={amount}
                            onChangeText={value => {
                                setError('')
                                setAmount(value);
                            }}
                            placeholder={'e.g. 50000'}
                            placeholderTextColor={COLORS.placeholder}
                            keyboardType='numeric'
                            returnKeyType='done'
                            style={styles.input}
                        />
                    </View>
                    {error && (
                        <Text style={styles.error}>
                            {error}
                        </Text>
                    )}

                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={saving}
                        className='mt-6 bg-brand-bg rounded-xl py-4 items-center mb-3'
                        activeOpacity={0.65}
                    >
                        <Text className='text-white text-sm font-semibold'>
                            {saving ? 'Saving...' : 'Save budget'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 16,
    },

    label: {
        marginBottom: 6,
        fontSize: 14,
        fontWeight: '500',
    },

    inputContainer: {
        height: 48,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#D1D5DB',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },

    inputError: {
        borderColor: '#EF4444',
    },

    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 0,
        fontSize: 16,
    },

    leftElement: {
        marginRight: 8,
    },

    rightElement: {
        marginLeft: 8,
    },

    error: {
        marginTop: 4,
        fontSize: 12,
        color: '#EF4444',
    },
});
