import images from '@/shared/constants/images'
import { formatPrice, getGreeting } from '@/shared/util/utils'
import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const QUICK_ACTIONS = [
    {
        icon: 'camera',
        label: "AI Receipt Scan",
        action: 'scan',
        color: '#1A85FF'
    },
    {
        icon: 'mic',
        label: 'Voice Entry',
        action: 'voice',
        color: '#FF6B4A'
    },
    {
        icon: 'plus',
        label: 'Add Manual',
        action: 'manual',
        color: '#3DDC84'
    }
] as const;

export interface HomeHeaderProps {
    user?: any;
    totalBalance: number;
    currency: string;
    monthIncome: number;
    monthExpense: number;

}
export default function HomeHeader({
    user,
    totalBalance,
    currency,
    monthIncome,
    monthExpense
}: HomeHeaderProps) {
    return (
        <View className='bg-brand-bg rounded-b-[28px] px-5 pt-5 pb-[22px]'>
            <View className='flex-row justify-between items-center mb-[22px]'>
                <Image
                    source={images.welthLight}
                    style={{ width: 80, height: '100%' }}
                    resizeMode='cover'
                />
                <View className='flex-row items-center gap-2.5'>
                    <View className='items-end'>
                        <Text className='text-brand-text-secondary text-xs'>{getGreeting()}</Text>
                        <Text className='text-brand-text-primary text-base font-medium'>{user?.fullName ?? 'there'}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/(root)/(tabs)/profile')}
                        className='w-[38px] h-[38px] rounded-full bg-[#1f222a] items-center justify-center overflow-hidden'
                    >
                        {
                            user?.imageUrl && user.hasImage ? (
                                <Image
                                    source={{ uri: user.imageUrl }}
                                    style={{ width: 38, height: 38 }}
                                    resizeMode='cover'
                                />
                            ) : (
                                <Feather name='user' size={18} color={'#8A8D96'} />
                            )
                        }
                    </TouchableOpacity>
                </View>
            </View>

            <View className='mb-[22px]'>
                <Text className='text-brand-text-secondary text-xs mb-1.5'>
                    Total balance
                </Text>
                <Text className='text-brand-text-primary text-[38px] font-medium tracking-tight'>
                    {formatPrice(totalBalance, currency)}
                </Text>

                <View className='flex-row gap-3.5 mt-2.5'>
                    <View className='flex-row items-center gap-1.5'>
                        <Feather name='arrow-up-right' size={14} color={'#3DDC84'} />
                        <Text className='text-brand-success text-[13px]'>
                            {formatPrice(monthIncome, currency)}
                        </Text>
                    </View>
                    <View className='flex-row items-center gap-1.5'>
                        <Feather name='arrow-down-right' size={14} color={'#FF6B4A'} />
                        <Text className='text-brand-coral text-[13px]'>
                            {formatPrice(monthExpense, currency)}
                        </Text>
                    </View>
                </View>
            </View>

            <View className='flex-row gap-2.5'>
                {
                    QUICK_ACTIONS.map((action, index) => (
                        <TouchableOpacity key={index}
                            activeOpacity={0.75}
                            onPress={() => {
                                router.push({
                                    pathname: '/(root)/(tabs)/add-transaction',
                                    params: { action: action.action }
                                })
                            }}
                            className='flex-1 bg-brand-surface rounded-2xl border border-brand-surface-border py-4 items-center gap-y-2'>
                            <View className='w-9 h-9 rounded-full items-center justify-center'
                                style={{ backgroundColor: `${action.color}26` }}>
                                <Feather name={action.icon} size={17} color={action.color} />
                            </View>
                            <Text className='text-[#B8BAC2] text-xs font-medium text-center'>
                                {action.label}
                            </Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>
    )
}
