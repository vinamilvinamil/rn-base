import { useSupabase } from "@/infrastructure/database/hooks/useSupabase";
import { useUserStore } from "@/shared/store/useStore";
import { useUser } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";
import { OnboardingFormValues } from "../schema/onboarding-schema";

export const useOnboardingForm = () => {
    const {user} = useUser();
    const setCurrency = useUserStore(state=> state.setCurrency);
    const setNeedsOnBoarding = useUserStore(state => state.setNeedsOnboarding);
    const authSupabase = useSupabase();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('')

    const onSubmit = async (values: OnboardingFormValues) => {
        const parsed = parseFloat(values.startingBalance.replace(/,/g, ""));
        setSaving(true);
        setError('');

        const {error: updateError} = await authSupabase
        .from('users')
        .update({
            currency: values.currency?.code
        })
        .eq("clerk_id", user!.id)
        if(updateError) {
            setSaving(false);
            setError("Something went wrong");
            return;
        }
        const {data: defaultAccount, error: accountFetchError} = await authSupabase
        .from('accounts')
        .select("id,balance")
        .eq("user_id", user!.id)
        .eq("is_default", true)
        .single();
        if(accountFetchError || !defaultAccount) {
            setSaving(false);
            setError("Something went wrong");
            return;
        }

        const  {error: txError} = await authSupabase
        .from('transactions')
        .insert({
            user_id: user!.id,
            account_id: defaultAccount.id,
            type: 'INCOME',
            amount: parsed,
            category: 'other_income',
            description: "starting balance",
            date: new Date().toISOString(),
            input_method: 'MANUAL'
        });
        if(txError) {
            setSaving(false);
            setError("Something went wrong");
            return;
        }

        const {error: balanceError} = await authSupabase
        .from('accounts')
        .update({balance: defaultAccount.balance + parsed})
        .eq("id", defaultAccount!.id);
        setSaving(false);
        if(balanceError) {
            setError("Something went wrong");
            return;
        }
        setCurrency(values.currency!.code);
        setNeedsOnBoarding(false);
        router.replace("/(root)/(tabs)")
    }
    return {
        onSubmit
    }
}