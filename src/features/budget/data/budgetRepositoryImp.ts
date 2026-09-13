import { Database } from "@/infrastructure/database/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { BudgetRepository } from "../domain/budgetRepository";
import { Budget } from "../domain/models/budget";

export class BudgetRepositoryImp implements BudgetRepository {
    constructor(private supabase: SupabaseClient<Database>) { }
    async getBudget(userId: string): Promise<Budget | null> {
        const {data, error} = await this.supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
        if(error) throw error;
        return data as Budget | null;
    }
    async upsertBudget(userId: string, amount: number): Promise<Budget> {
        const {data, error} = await this.supabase
        .from('budgets')
        .upsert({user_id: userId, amount}, {onConflict: 'user_id'})
        .select()
        .single();
        if(error) throw error;
        return data as Budget;
    }     
}