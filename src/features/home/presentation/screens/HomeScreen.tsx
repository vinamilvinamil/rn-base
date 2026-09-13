import { useUser } from '@clerk/expo';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExpenseBreakdownSection from '../components/ExpenseBreakdownSection';
import HomeHeader from '../components/HomeHeader';
import MonthlyBudgetSection from '../components/MonthlyBudgetSection';
import RecentTransactionSection from '../components/RecentTransactionSection';
import { useHomeHook } from '../hooks/useHomeHook';

export default function HomeScreen() {
    const { user } = useUser();
    const { refreshing,
        totalBalance,
        monthIncome,
        monthExpense,
        expenseBreakdown,
        currency,
        budget,
        recentTransactions,
        loading,
        onRefresh } = useHomeHook();

    return (
        <SafeAreaView className='flex-1 bg-brand-bg' edges={['top']}>
            <ScrollView
                className='flex-1 bg-brand-body'
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header component */}
                <HomeHeader
                    currency={currency}
                    monthExpense={monthExpense}
                    monthIncome={monthIncome}
                    totalBalance={totalBalance}
                    user={user}
                />


                <View className='px-5 pt-[18px] pb-5'>

                    {/* Ask AI Component*/}
                    <TouchableOpacity
                        onPress={() => router.push('/(root)/(tabs)/assistant')}
                        className='bg-white rounded-[18px] border border-[#E8E6DF] p-5 flex-row items-center gap-2.5 mb-[18px]'>
                        <View className='w-[26px] h-[26px] rounded-[26px] bg-[#4A9EFF1A] items-center justify-center'>
                            <View className='w-[7px] h-[7px] rounded-full bg-brand-blue' />
                        </View>
                        <Text className='text-brand-text-muted text-[13px] flex-1'>
                            Ask AI anything about your money
                        </Text>
                        <Feather name='arrow-right' size={16} color={'#4A9EFF'} />
                    </TouchableOpacity>

                    {/* Monthly budget */}
                    <MonthlyBudgetSection
                        budget={budget}
                        currency={currency}
                        monthExpense={monthExpense}
                    />

                    {/* Chart expense */}
                    {
                        expenseBreakdown.length > 0 && (
                            <ExpenseBreakdownSection
                                currency={currency}
                                expenseBreakdown={expenseBreakdown}
                            />
                        )
                    }

                    {/* Recent transaction */}
                    <RecentTransactionSection
                        currency={currency}
                        loading={loading}
                        recentTransactions={recentTransactions}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

