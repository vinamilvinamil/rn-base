import { useAuth, useSignUp } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";
import { CodeFormValues } from "../schema/signin-schema";
import { SignUpFormValues } from "../schema/signup-schema";

export const useSignUpForm = () => {
    const { signUp, errors, fetchStatus } = useSignUp();
    const { isSignedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [showVerifyUI, setShowVerifyUI] = useState(false);

    const onSubmit = async (values: SignUpFormValues) => {
        setEmail(values.email);

        const { error } = await signUp.password({
            emailAddress: values.email,
            password: values.password,
            firstName: values.firstName,
            lastName: values.lastName,
        });

        if (error) {
            console.log(JSON.stringify(error, null, 2));
            return false;
        }

        await signUp.verifications.sendEmailCode();
        if (signUp.status === 'missing_requirements' &&
            signUp.unverifiedFields.includes('email_address') &&
            signUp.missingFields.length === 0
        ) {
            setShowVerifyUI(true);
        }
        return true;
    };

    const onVerifyPress = async ({ code }: CodeFormValues) => {
        await signUp.verifications.verifyEmailCode({ code });
        if (signUp.status === 'complete') {
            await signUp.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) return;
                    const url = decorateUrl('/');
                    router.replace(url as any)
                }
            })
        } else {
            console.error("Sign up attemp not complete", signUp);
        }
    }

    const requestNewCode = () => {
        signUp.verifications.sendEmailCode();
    }

    const isSignined = signUp.status === 'complete' || isSignedIn
    return {
        onSubmit,
        onVerifyPress,
        requestNewCode,
        isSignined,
        showVerifyUI,
        email,
        errors,
        fetchStatus
    }
}