import SignInForm from '../components/SignInForm';
import { useSignInForm } from '../hooks/useSignInForm';
import { SignInFormValues } from '../schema/signin-schema';

export default function SignInScreen() {
    const { onSubmit, onLoginBiometric, isSignined, errors, hasCredentials, biometricType } = useSignInForm();

    const handleSubmit = async (values: SignInFormValues) => {
        const result = await onSubmit(values);
    }

    if (isSignined) {
        return null;
    }
    return (
        <SignInForm onSubmit={handleSubmit}
            biometricType={biometricType}
            hasCredentials={hasCredentials}
            onBiometricLogin={onLoginBiometric}
        />
    )
}
