import { BudgetRepositoryImp } from "@/features/budget/data/budgetRepositoryImp";
import { BudgetRepository } from "@/features/budget/domain/budgetRepository";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";

export const createBudgetRepository= (supabase: SupabaseClient<Database>)  : BudgetRepository=> {
    return new BudgetRepositoryImp(supabase);
}