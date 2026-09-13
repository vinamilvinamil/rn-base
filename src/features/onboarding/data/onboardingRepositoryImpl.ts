import { Database } from "@/infrastructure/database/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { DefaultAccount } from "../domain/models/account";
import { OnboardingRepository } from "../domain/onboardingRepository";

export class OnboardingRepositoryImpl implements OnboardingRepository {
    constructor(private readonly supabase: SupabaseClient<Database>) {}

    async updateUserCurrency(userId: string, currency: string): Promise<void> {
        const {error} = await this.supabase
        .from('users')
        .update({currency})
        .eq('clerk_id', userId);
        if(error) throw error;
    }
    async getDefaultAccount(userId: string): Promise<DefaultAccount> {
        const {data, error} = await this.supabase
        .from('accounts')
        .select('id, balance')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();
        if(error) throw error;
        return data;
    }
    async createTransaction(params: { userId: string; accountId: string; amount: number; }): Promise<void> {
        const { error } = await this.supabase
      .from('transactions')
      .insert({
        user_id: params.userId,
        account_id: params.accountId,
        type: 'INCOME',
        amount: params.amount,
        category: 'other_income',
        description: 'starting balance',
        date: new Date().toISOString(),
        input_method: 'MANUAL',
      });

    if (error) throw error;
    }
    async updateAccountBalance(accountId: string, balance: number): Promise<void> {
        const { error } = await this.supabase
      .from('accounts')
      .update({ balance })
      .eq('id', accountId);

    if (error) throw error;
    }
    
}