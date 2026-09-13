import SignInForm from '../components/SignInForm';
import VerifyCodeForm from '../components/VerifyCodeForm';
import { useSignInForm } from '../hooks/useSignInForm';
import { CodeFormValues, SignInFormValues } from '../schema/signin-schema';

export default function SignInScreen() {
    const { onSubmit, onLoginBiometric, onVerifyPress, requestNewCode, showVerifyUI, isSignined, authError, hasCredentials, biometricType } = useSignInForm();

    const handleSubmit = async (values: SignInFormValues) => {
        const result = await onSubmit(values);
    }

    const handleVerification = async (values: CodeFormValues) => {
            await onVerifyPress(values);
        }

    if (isSignined) {
        return null;
    }

    if (showVerifyUI) {
            return (
                <VerifyCodeForm
                    onSubmit={handleVerification}
                    email={'your email'}
                    requestNewCode={requestNewCode}
                />
            )
        }
        
    return (
        <SignInForm onSubmit={handleSubmit}
            biometricType={biometricType}
            hasCredentials={hasCredentials}
            authError={authError}
            onBiometricLogin={onLoginBiometric}
        />
    )
}
