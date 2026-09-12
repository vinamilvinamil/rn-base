import { useAuth, useUser } from "@clerk/expo";

export const useProfile = () => {
    const {user} = useUser();
    const {signOut} = useAuth();
    return {
        user,
        signOut
    }
}