import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthError, AuthErrorCode } from '../../domain/errors/AuthError';
import { useLogin } from '../hooks/useLogin';
import {
    createLoginSchema,
    type LoginForm as LoginFormValues,
} from '../validation/loginSchema';

export const LoginForm = () => {
    const { t } = useTranslation();
    const { mutateAsync, isPending } = useLogin();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const loginSchema = createLoginSchema(t);
    const {
        control,
        handleSubmit,
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const convertErrorMessage = (error_code : AuthErrorCode) => {
        switch(error_code) {
            case 'INVALID_CREDENTIALS' :
                setErrorMessage(t('auth.errors.account_invalid'))
                break;
            case 'SESSION_EXPIRED':
                setErrorMessage(t('auth.errors.session_expired'))
        }
    }

    const onSubmit = async (values: LoginFormValues) => {
        try {
            await mutateAsync(values);
        } catch (error) {
            if(error instanceof AuthError) {
                convertErrorMessage(error.code)
                return;
            }
            console.error('Unknown error:', error);
        }
    };

    return (
        <View>
            <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                    <Input
                        label={t('auth.login.email')}
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        error={fieldState.error?.message}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        leftElement={ <Ionicons name="mail-outline" size={20} color="#6B7280" /> }
                    />
                )}
            />

            <Controller
                control={control}
                name="password"
                render={({ field, fieldState }) => (
                    <Input
                        label={t('auth.login.password')}
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        error={fieldState.error?.message}
                        secureTextEntry
                        leftElement={ <Ionicons name="lock-closed-outline" size={20} color="#6B7280" /> }
                    />
                )}
            />

            {
                errorMessage ?
                <Text className='text-error text-base mb-4'>{errorMessage}</Text>
                : null
            }

            <Button
                title={t('auth.login.submit')}
                onPress={handleSubmit(onSubmit)}
                loading={isPending}
                disabled={isPending}
                fullWidth
            />
        </View>
    );
};