import TransactionRow from '@/features/home/presentation/components/TransactionRow';
import { ChipText } from '@/shared/components/ChipText';
import { SearchBox } from '@/shared/components/SearchBox';
import { useUserStore } from '@/shared/store/useStore';
import { Feather } from '@expo/vector-icons';
import { eachDayOfInterval, format, startOfDay, startOfMonth } from 'date-fns';
import { ActivityIndicator, Alert, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Transaction } from '../../domain/models/transactions';
import { useTransactionForm } from '../hooks/useTransactionForm';

export const TRANSACTION_FILTERS = ['All', "Income", "Expense"] as const;

export function dayKey(date: Date) {
    return format(date, 'yyyy-MM-dd');
}

export function currentMonthDays() {
    const today = startOfDay(new Date());
    return eachDayOfInterval({
        start: startOfMonth(today),
        end: today
    }).map(d => ({ key: dayKey(d), label: format(d, 'd MMM') }))
}

export default function TransactionScreen() {
    const {
        loading, refetching, error,
        exporting,
        activeFilter, setActiveFilter, search, setSearch, activeAccountId, setActiveAccountId,
        accounts,
        filteredTransactions,
        dailyIncomeExpense,
        loadData,
        removeTransaction,
        handleExport
    } = useTransactionForm();
    const currency = useUserStore(state => state.currency);

    const handleDelete = (item: Transaction) => {
        Alert.alert(
            "Delete transaction",
            "Are you sure you want to delete this transaction?",
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await removeTransaction(item);
                        } catch (error) {
                            Alert.alert('Error', "Couldn't delete this transaction")
                        }
                    }
                }
            ]
        )
    }
    return (
        <SafeAreaView className='flex-1 bg-brand-body' edges={['top']}>
            <View className='px-5 pt-3 pb-2'>
                <View className='flex-row items-center justify-between mb-3'>
                    <Text className='text-brand-bg text-xl font-semibold' >
                        Transactions
                    </Text>
                    <TouchableOpacity
                        onPress={handleExport}
                        disabled={exporting}
                        className='w-9 h-9 rounded-full bg-white border border-[#E8E6DF] items-center justify-center'
                    >
                        {
                            exporting ? (
                                <ActivityIndicator size={'small'} color="#5C5F68" />
                            ) : (
                                <Feather name='download' size={15} color={'#5C5F68'} />
                            )
                        }
                    </TouchableOpacity>
                </View>

                <SearchBox
                    value={search}
                    onChangeText={setSearch}
                    enableClear={true}
                    placeholder='Search transactions'
                />

                <View className='flex-row gap-2 my-2.5'>
                    {
                        TRANSACTION_FILTERS.map((filter) => (
                            <ChipText
                                key={filter}
                                title={filter}
                                active={activeFilter === filter}
                                setValue={(_data) => setActiveFilter(_data as any)}
                            />

                        ))
                    }
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className='h-11'>
                    <View className='flex-row gap-2 '>
                        <ChipText
                            title='All Accounts'
                            active={activeAccountId === null}
                            setValue={() => setActiveAccountId(null)}
                        />
                        {
                            accounts?.map((account) => (
                                <ChipText
                                    title={account.name}
                                    key={account.id}
                                    active={activeAccountId === account.id}
                                    setValue={(data) => setActiveAccountId(data)}
                                />
                            ))
                        }
                    </View>
                </ScrollView>
                <View className='h-2.5' />
                {
                    loading ? (
                        <View className='flex-1 items-center justify-center'>
                            <ActivityIndicator color={'#4A9EFF'} />
                        </View>
                    ) : error ? (
                        <View className='flex-col flex-1  px-10 justify-center items-center min-h-52'>
                            <Feather name='alert-circle' size={32} color={'#FF6B4A'} />
                            <Text className='text-brand-text-muted text-sm mt-3 text-center'>
                                Could not load transactions
                            </Text>
                            <TouchableOpacity className='mt-4 bg-brand-bg rounded-full px-4 py-2'
                                onPress={() => loadData()}>
                                <Text className='text-white text-xs font-medium'>Retry</Text>
                            </TouchableOpacity>
                        </View>

                    ) : (
                        <FlatList data={filteredTransactions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TransactionRow
                                    tx={item}
                                    currency={currency}
                                    onDelete={() => handleDelete(item)}
                                />
                            )}
                            contentContainerStyle={{
                                paddingTop: 8,
                                paddingBottom: 100
                            }}
                            refreshControl={
                                <RefreshControl refreshing={refetching} onRefresh={loadData} />
                            }
                            ListHeaderComponent={
                                filteredTransactions.length > 0 ? (
                                    <View className='bg-white rounded-2xl border border-[#E8E6DF] p-4 mb-4'>
                                        <View className='flex-row justify-between items-center mb-3'>
                                            <Text className='text-brand-bg text-xs font-medium'>
                                                Daily income and expense
                                            </Text>
                                            <View className='flex-row gap-3'>
                                                <View className='flex-row items-center gap-1'>
                                                    <View className='w-2 h-2 rounded-full bg-brand-success'>
                                                    </View>
                                                    <Text className='text-[10px]'>
                                                        Income
                                                    </Text>
                                                </View>
                                                <View className='flex-row items-center gap-1'>
                                                    <View className='w-2 h-2 rounded-full bg-brand-coral'>
                                                    </View>
                                                    <Text className='text-[10px]'>
                                                        Expense
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <BarChart
                                                data={dailyIncomeExpense}
                                                width={Math.max(dailyIncomeExpense.length * 9, 280)}
                                                height={120}
                                                barWidth={6}
                                                spacing={4}
                                                hideYAxisText
                                                xAxisColor={'#E8E6DF'}
                                                yAxisColor={'transparent'}
                                                rulesColor={'#F0EEE7'}
                                                noOfSections={3}
                                                xAxisLabelTextStyle={{ color: '#8A8D96', fontSize: 7 }}
                                                isThreeD={false}
                                                roundedTop
                                            />
                                        </ScrollView>
                                    </View>) : null
                            }
                            ListEmptyComponent={
                                <View className='items-center justify-center py-20'>
                                    <Feather name='inbox' size={32} color={'#BDC3C7'} />
                                    <Text className='text-brand-text-muted text-sm mt-3'>
                                        {search ? "No matching transactions" : "No transactions yet"}
                                    </Text>
                                </View>
                            }
                        />
                    )
                }



            </View>
        </SafeAreaView>
    )
}
