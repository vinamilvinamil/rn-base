import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import images from '@/shared/constants/images';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Image, KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import { SignUpFormValues, signUpSchema } from '../schema/signup-schema';

export interface SignUpFormProps {
    loading?: boolean;
    onSubmit: (values: SignUpFormValues) => void;
}
export default function SignUpForm({
    loading = false,
    onSubmit
}: SignUpFormProps) {

    const {
        control,
        handleSubmit,
        formState: { errors: formErrors }
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            password: ''
        }
    });
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
                    Create account
                </Text>
                <Text className='text-brand-text-muted text-base mb-8'>
                    Track your money, powered by AI
                </Text>

                <View className='flex-row gap-3 mb-1'>
                    <View className='flex-1'>
                        <Controller
                            control={control}
                            name='firstName'
                            render={({ field, fieldState }) => (
                                <Input
                                    label={'First Name'}
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    error={fieldState.error?.message}
                                    placeholder={'First Name'}
                                    editable={!loading}
                                />
                            )}
                        />
                    </View>
                    <View className='flex-1'>
                        <Controller
                            control={control}
                            name='lastName'
                            render={({ field, fieldState }) => (
                                <Input
                                    label={'Last Name'}
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    error={fieldState.error?.message}
                                    placeholder={'Last Name'}
                                    editable={!loading}
                                />
                            )}
                        />
                    </View>
                </View>
                <Controller
                    control={control}
                    name='email'
                    render={({ field, fieldState }) => (
                        <Input
                            label={'Email'}
                            value={field.value}
                            onChangeText={field.onChange}
                            onBlur={field.onBlur}
                            error={fieldState.error?.message}
                            placeholder={'Email'}
                            editable={!loading}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='password'
                    render={({ field, fieldState }) => (
                        <Input
                            label={'Password'}
                            value={field.value}
                            onChangeText={field.onChange}
                            onBlur={field.onBlur}
                            error={fieldState.error?.message}
                            placeholder={'Password'}
                            editable={!loading}
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
                <View className='flex-row justify-center'>
                    <Text className='text-brand-text-muted'>
                        Already have an account? {" "}
                    </Text>
                    <Link href={'/sign-in'}>
                        <Text className='text-brand-blue font-semibold'>
                            Sign In
                        </Text>
                    </Link>
                </View>

                {/* Required by clerk for bot protection */}
                <View nativeID='clerk-captcha'/>
            </View>
        </KeyboardAvoidingView>
    )
}
