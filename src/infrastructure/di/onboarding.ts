import { OnboardingRepositoryImpl } from "@/features/onboarding/data/onboardingRepositoryImpl";
import { OnboardingRepository } from "@/features/onboarding/domain/onboardingRepository";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";

export const createOnboardingRepository= (supabase: SupabaseClient<Database>)  : OnboardingRepository=> {
    return new OnboardingRepositoryImpl(supabase);
}