import { useAuth, useSignIn } from "@clerk/expo";
import { useLocalCredentials } from '@clerk/expo/local-credentials';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from "expo-router";
import { useState } from "react";
import { CodeFormValues, SignInFormValues } from "../schema/signin-schema";

export const useSignInForm = () => {
    const { signIn, errors, fetchStatus } = useSignIn();
    const { isSignedIn } = useAuth();
    const { hasCredentials, setCredentials, biometricType, authenticate } = useLocalCredentials();
    const [showVerifyUI, setShowVerifyUI] = useState(false);
    const [authError, setAuthError] = useState('');
    const isSignined = signIn.status === 'complete' || isSignedIn

    const onSubmit = async (values: SignInFormValues) => {
        const { error } = await signIn.password({
            emailAddress: values.email,
            password: values.password
        });

        if (error) {
            console.log(JSON.stringify(error, null, 2));
            setAuthError(error.message);
            return error.message;
        }
        if (signIn.status === 'complete') {
            if (values.remeberMe) {
                console.log('save crediential');
                await setCredentials({
                    identifier: values.email,
                    password: values.password
                });
                console.log('done save crediential')
            }
            await signIn.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) return;
                    const url = decorateUrl('/');
                    router.replace(url as any)
                }
            })
        } else if (signIn.status == 'needs_client_trust') {
            const { error } = await signIn.mfa.sendEmailCode();

            if (error) {
                console.error('Prepare client trust error:', error);
                setAuthError(error.message);
                return error.message;
            }
            setShowVerifyUI(true);
            return true;

        } else {
            console.error("Sign in attemp not complete", signIn);
        }
        return true;
    };

    const onLoginBiometric = async () => {
        if (!hasCredentials) {
            throw new Error(
                'No local credentials available',
            );
        }
        // Check if hardware supports it and if the simulator actually has a Face enrolled
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        console.log('info hardware', hasHardware, isEnrolled)
        if (!hasHardware || !isEnrolled) {
            console.warn("Simulator biometric hardware or enrollment missing. Make sure Features -> Face ID -> Enrolled is checked.");
            return;
        }
         
        const signInAttempt = await authenticate();
        console.log('6. authenticate result:', signInAttempt);
        if (signInAttempt.status === 'complete') {
            router.replace('/');
        } else {
            console.error("Sign in biometric attemp not complete", signIn);
        }
    }

    const onVerifyPress = async ({ code }: CodeFormValues) => {
        await signIn.mfa.verifyEmailCode({ code });
        if (signIn.status === 'complete') {
            await signIn.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) return;
                    const url = decorateUrl('/(root)/(tabs)');
                    router.replace(url as any)
                }
            })
        } else {
            console.error("Sign up attemp not complete", signIn);
        }
    }

    const requestNewCode = () => {
        signIn.mfa.sendEmailCode();
    }

    return {
        onSubmit,
        onLoginBiometric,
        onVerifyPress,
        requestNewCode,
        showVerifyUI,
        hasCredentials,
        biometricType,
        isSignined,
        errors,
        authError,
        fetchStatus
    }
}