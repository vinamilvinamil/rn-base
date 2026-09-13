
import { getCategoryConfig } from '@/shared/constants/categories'
import { formatPrice } from '@/shared/util/utils'
import { Text, View } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
export interface ExpenseBreakdownSectionProps {
    expenseBreakdown: {
        category: string;
        amount: number;
        color: any
    }[];
    currency: string;
}
export default function ExpenseBreakdownSection({
    expenseBreakdown,
    currency
}: ExpenseBreakdownSectionProps) {
    return (
        <View className='bg-white rounded-[18px] border border-[#E8D6DF] p-4 mb-[18px]'>
            <Text className='text-[#1A1D26] text-sm font-medium mb-2.5'>
                Expense breakdown (this month)
            </Text>
            <View className='flex-row items-center'>
                <PieChart
                    data={expenseBreakdown.map((c) => ({
                        value: c.amount,
                        color: c.color
                    }))}
                    radius={60}
                    innerRadius={38}
                    innerCircleColor={'#FFF'}
                />
                <View className='flex-1 ml-4 gap-1.5'>
                    {
                        expenseBreakdown.slice(0, 6).map(c => (
                            <View key={c.category}
                                className='flex-row items-center justify-between'>
                                <View className='flex-row items-center gap-1.5'>
                                    <View
                                        className='w-2 h-2 rounded-full' style={{ backgroundColor: c.color }} />
                                    <Text className='text-brand-text-secondary text-xs'>
                                        {getCategoryConfig(c.category as any).label}
                                    </Text>
                                </View>
                                <Text className='text-brand-bg text-xs font-medium'>
                                    {formatPrice(c.amount, currency)}
                                </Text>
                            </View>
                        ))
                    }
                </View>
            </View>
        </View>
    )
}
