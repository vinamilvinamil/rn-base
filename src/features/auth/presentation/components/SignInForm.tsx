import { Button } from '@/shared/components/Button';
import { Checkbox } from '@/shared/components/Checkbox';
import { Input } from '@/shared/components/Input';
import { KeyboardAvoidingView } from '@/shared/components/KeyboardAvoidingView';
import images from '@/shared/constants/images';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Image, Text, View } from 'react-native';
import { SignInFormValues, signInSchema } from '../schema/signin-schema';

export interface SignInFormProps {
    loading?: boolean;
    error?: String;
    biometricType?: 'fingerprint' | 'face-recognition' | null;
    hasCredentials: boolean;
    authError: string;
    onSubmit: (values: SignInFormValues) => void;
    onBiometricLogin: () => void;
}
export default function SignInForm({
    loading = false,
    error,
    biometricType,
    hasCredentials,
    authError,
    onSubmit,
    onBiometricLogin
}: SignInFormProps) {

    const {
        control,
        handleSubmit,
        formState: { errors: formErrors }
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: '',
            remeberMe: false
        }
    });
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
                    Signin Account
                </Text>
                <Text className='text-brand-text-muted text-base mb-8'>
                    Track your money, powered by AI
                </Text>

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
                            keyboardType='email-address'
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
                <Controller
                    control={control}
                    name='remeberMe'
                    render={({ field, fieldState }) => (
                        <Checkbox
                            label={'Remember me?'}
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                            disabled={loading}
                        />
                    )}
                />

                {
                    authError &&
                    <Text className='text-[#EF4444] text-sm self-center mb-4'>
                        {authError}
                    </Text>
                }

                <View className='mt-2 my-4'>
                    <Button
                        title='Sign In'
                        disabled={loading}
                        fullWidth
                        className='bg-brand-blue'
                        onPress={handleSubmit(onSubmit)}
                    />
                    {hasCredentials && (
                        <Button
                            className='mt-4 bg-brand-blue'
                            title={
                                biometricType === 'face-recognition'
                                    ? 'Sign in with Face ID'
                                    : 'Sign In with Finger'
                            }
                            onPress={onBiometricLogin}
                        />
                    )}
                </View>
                <View className='flex-row justify-center'>
                    <Text className='text-brand-text-muted'>
                        Don't have an account? {" "}
                    </Text>
                    <Link href={'/sign-up'}>
                        <Text className='text-brand-blue font-semibold'>
                            Sign Up
                        </Text>
                    </Link>
                </View>

                {/* Required by clerk for bot protection */}
                <View nativeID='clerk-captcha' />
            </View>
        </KeyboardAvoidingView>
    )
}
