import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import images from '@/shared/constants/images';
import { Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { CodeFormValues, codeSchema } from '../schema/signin-schema';

export interface VerifyCodeFormProps {
    loading?: boolean;
    email: String;
    onSubmit: (values: CodeFormValues) => void;
    requestNewCode: () => void
}
export default function VerifyCodeForm({
    loading = false,
    email,
    onSubmit,
    requestNewCode
}: VerifyCodeFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<CodeFormValues>({
        resolver: zodResolver(codeSchema),
        mode: 'onBlur',
        defaultValues: {
            code: ''
        }
    })
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className='flex-1 bg-brand-body'
        >
            <View className='flex-1 justify-center px-6 -mt-16'>
                <Image
                    source={images.welth}
                    className='w-36 h-16 mb-8'
                    resizeMode='contain'
                />
                <Text className='text-3xl font-bold text-[#1A1D26] mb-2 leading-tight'>
                    Verify your account
                </Text>
                <Text className='text-brand-text-muted text-base mb-8'>
                    We sent a code to {email}
                </Text>

                <Controller
                    control={control}
                    name='code'
                    render={({ field, fieldState }) => (
                        <Input
                            value={field.value}
                            onChangeText={field.onChange}
                            onBlur={field.onBlur}
                            error={fieldState.error?.message}
                            placeholder={'Enter verification code'}
                            editable={!loading}
                        />
                    )}
                />

                <View className='mt-2 my-4'>
                    <Button
                        title='Verify'
                        disabled={loading}
                        fullWidth
                        className='bg-brand-blue'
                        onPress={handleSubmit(onSubmit)}
                    />
                    <TouchableOpacity
                    onPress={requestNewCode}
                    className='py-2'>
                        <Text className='text-brand-blue text-sm'>
                            I need a new code
                        </Text>
                    </TouchableOpacity>
                </View>


                {/* Required by clerk for bot protection */}
                <View nativeID='clerk-captcha' />
            </View>
        </KeyboardAvoidingView>
    )
}
