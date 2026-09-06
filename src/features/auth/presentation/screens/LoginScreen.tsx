import { StyleSheet, View } from 'react-native';

import { LoginForm } from '../components/LoginForm';

export const LoginScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <LoginForm />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    formContainer: {
        width: '100%',
    },
});