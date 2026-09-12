import { Button } from '@/shared/components/Button';
import { useLocalCredentials } from '@clerk/expo/local-credentials';
import { router } from 'expo-router';
import { Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../hooks/useProfile';

export default function ProfileScreen() {
    const { user, signOut } = useProfile();
    const {hasCredentials, biometricType} = useLocalCredentials()
    console.log('yyyyy', hasCredentials, biometricType)
    const handleSignOut = () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: 'Cancel', style: 'cancel' },
            {
                text: "Sign out",
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                    router.replace('/sign-in');
                }
            }
        ])
    }
    return (
        <SafeAreaView className='flex-1 justify-center items-center bg-brand-body' edges={['top']}>
            <Text className='text-2xl text-brand-text-muted'>{
                user?.fullName}</Text>
            <Button
                onPress={handleSignOut}
                title='Sign Out'
            />
        </SafeAreaView>
    );
}

