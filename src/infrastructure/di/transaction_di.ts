import { TransactionRepositoryImp } from "@/features/transactions/data/transactionRepositoryImp";
import { TransactionRepository } from "@/features/transactions/domain/transactionRepository";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";

export const createTransactionRepository = (supabase: SupabaseClient<Database>): TransactionRepository => {
    return new TransactionRepositoryImp(supabase);
}