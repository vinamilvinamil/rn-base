import { Transaction } from '@/features/transactions/domain/models/transactions'
import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import TransactionRow from './TransactionRow'

export interface RecentTransactionSectionProps {
    loading: boolean;
    currency: string;
    recentTransactions: Transaction[]
}
export default function RecentTransactionSection({
    loading,
    currency,
    recentTransactions
}: RecentTransactionSectionProps) {
    return (
        <>
            <View className='flex-row justify-between items-center mb-3'>
                <Text className='text-[#1A1D26] text-sm font-medium'>
                    Recent Transactions
                </Text>
                <TouchableOpacity
                    onPress={() => router.push('/(root)/(tabs)/transactions')}

                >
                    <Text className='text-brand-text-secondary text-xs'>
                        See all
                    </Text>
                </TouchableOpacity>
            </View>

            {
                loading ?
                    <View className='items-center py-6'>
                        <ActivityIndicator color={'#4A9EFF'} />
                    </View>
                    : recentTransactions.length === 0 ?
                        <View className='items-center py-6'>
                            <Feather name='inbox' size={28} color={'#BDC3C7'} />
                            <Text className='text-brand-text-muted text-sm mt-3'>
                                No Transaction yet
                            </Text>
                        </View>
                        : (
                            recentTransactions.map(tx => (
                                <TransactionRow key={tx.id} tx={tx} currency={currency} />
                            ))
                        )
            }
        </>
    )
}
