import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function OnboardingScreen() {
    return (
        <SafeAreaView edges={['top']} className='flex-1 justify-center items-center'>
            <Text>Onboarding Screen</Text>
        </SafeAreaView>
    )
}
