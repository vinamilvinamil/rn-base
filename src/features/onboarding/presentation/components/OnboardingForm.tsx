import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { KeyboardAvoidingView } from '@/shared/components/KeyboardAvoidingView'
import { Select, SelectOption } from '@/shared/components/Select'
import { ALL_CURRENCIES, CurrencyEntry } from '@/shared/constants/currencies'
import images from '@/shared/constants/images'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Image, Text, View } from 'react-native'
import { OnboardingFormValues, onboardingSchema } from '../schema/onboarding-schema'

export interface OnboardingFormProps {
    loading?: boolean;
    onSubmit: (values: OnboardingFormValues) => void;
}

export default function OnboardingForm({
    loading = false,
    onSubmit
}: OnboardingFormProps) {
    const currencyOptions: SelectOption<CurrencyEntry>[] = ALL_CURRENCIES.map(c => ({
        value: c,
        label: c.name
    }))
    const {
        control,
        formState: {errors},
        handleSubmit
    } = useForm<OnboardingFormValues>(
        {
            resolver: zodResolver(onboardingSchema),
            mode: 'onBlur',
            defaultValues: { startingBalance: '', currency: null}
        }
    )
    return (
        <KeyboardAvoidingView
        style={{flex: 1}}
        >
            <View className='flex-1 justify-center px-6 -mt-16'>
                <Image
                    source={images.welth}
                    className='w-36 h-16 mb-8'
                    resizeMode='contain'
                />
                <Text className='text-3xl font-bold text-[#1A1D26] mb-2 leading-tight'>
                    Let&apos;s get you set up
                </Text>
                <Text className='text-brand-text-muted text-base mb-8'>
                    A couple of quick details to personalise your experiences.
                </Text>

                <Controller
                    control={control}
                    name='startingBalance'
                    render={({ field, fieldState }) => (
                        <Input
                            label={'Starting balance'}
                            value={field.value}
                            onChangeText={field.onChange}
                            onBlur={field.onBlur}
                            error={fieldState.error?.message}
                            placeholder={'e.g. 50000'}
                            editable={!loading}
                            keyboardType='numeric'
                            returnKeyType='done'
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="currency"
                    render={({ field, fieldState }) => (
                        <Select
                            label={'Currency'}
                            placeholder={'e.g. INR'}
                            value={field.value}
                            options={currencyOptions}
                            onChange={field.onChange}
                            compareValue={(x, y) => x?.code === y?.code}
                            error={fieldState.error?.message}
                            disabled={loading}
                            enableSearch={true}
                            bottomSheetTitle={'Currency'}
                        />
                    )}
                />
                
                <View className='mt-2 my-4'>
                    <Button
                        title='Sign Up'
                        disabled={loading}
                        fullWidth
                        className='bg-brand-blue'
                        onPress={handleSubmit(onSubmit)}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}
