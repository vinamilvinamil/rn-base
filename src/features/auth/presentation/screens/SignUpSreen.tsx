import SignUpForm from '../components/SignUpForm';
import VerifyCodeForm from '../components/VerifyCodeForm';
import { useSignUpForm } from '../hooks/useSignUpForm';
import { CodeFormValues } from '../schema/signin-schema';
import { SignUpFormValues } from '../schema/signup-schema';

export default function SignUpScreen() {
    const { onSubmit, onVerifyPress, requestNewCode, showVerifyUI, email, isSignined } = useSignUpForm();

    const handleSubmit = async (values: SignUpFormValues) => {
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
                email={email}
                requestNewCode={requestNewCode}
            />
        )
    }
    return (
        <SignUpForm onSubmit={handleSubmit} />
    )
}
