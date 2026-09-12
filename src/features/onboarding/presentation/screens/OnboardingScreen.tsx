import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingForm from '../components/OnboardingForm';
import { useOnboardingForm } from '../hooks/useOnboardingForm';
import { OnboardingFormValues } from '../schema/onboarding-schema';

export default function OnboardingScreen() {
    const {onSubmit} = useOnboardingForm();
    const handleSubmit = async (values: OnboardingFormValues) => {
        await onSubmit(values);
    }
    return (
        <SafeAreaView edges={['top']} className='flex-1 justify-center items-center'>
            <OnboardingForm
                onSubmit={handleSubmit}
            />
        </SafeAreaView>
    )
}
