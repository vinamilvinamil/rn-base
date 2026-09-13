import { Database } from "@/infrastructure/database/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { Transaction, TransactionFilters } from "../domain/models/transactions";
import { TransactionRepository } from "../domain/transactionRepository";

export class TransactionRepositoryImp implements TransactionRepository {
    constructor(private supabase: SupabaseClient<Database>) { }
    async getTransactions(userId: string, filters: TransactionFilters = {}): Promise<Transaction[]> {
        let query = this.supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId);
        if (filters.type) {
            query = query.eq('type', filters.type)
        }
        if (filters.accountId) {
            query = query.eq('account_id', filters.accountId)
        }
        const { data, error } = await query.order('date', { ascending: false });
        if (error) throw error;
        return data as Transaction[];
    }



}