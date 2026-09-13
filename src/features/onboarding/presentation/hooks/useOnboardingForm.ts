import { useSupabase } from "@/infrastructure/database/hooks/useSupabase";
import { createOnboardingRepository } from "@/infrastructure/di";
import { useUserStore } from "@/shared/store/useStore";
import { useUser } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";
import { OnboardingFormValues } from "../schema/onboarding-schema";

export const useOnboardingForm = () => {
    const { user } = useUser();
    const setCurrency = useUserStore(state => state.setCurrency);
    const setNeedsOnBoarding = useUserStore(state => state.setNeedsOnboarding);
    const authSupabase = useSupabase();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('')
    const onboardingRepository = createOnboardingRepository(authSupabase);

    const onSubmit = async (values: OnboardingFormValues) => {
        if (!user) return;
        setSaving(true);
        setError('');
        try {
            const parsed = parseFloat(values.startingBalance.replace(/,/g, ""));
            //update currency
            await onboardingRepository.updateUserCurrency(user.id, values.currency.code)

            //get default accouunt
            const defaultAccount = await onboardingRepository.getDefaultAccount(user.id);
            if (!defaultAccount) {
                return;
            }

            //create transaction
            await onboardingRepository.createTransaction({
                userId: user.id,
                accountId: defaultAccount.id,
                amount: parsed,
            })

            //update balance to account
            await onboardingRepository.updateAccountBalance(defaultAccount.id, defaultAccount.balance + parsed)

            setCurrency(values.currency.code);
            setNeedsOnBoarding(false);
            router.replace("/(root)/(tabs)")


        } catch (error) {
            setSaving(false);
            setError("Something went wrong");
        }
    }
    return {
        onSubmit
    }
}