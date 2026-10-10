import { Database } from "@/infrastructure/database/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { ExtractedTransaction, NewTransaction, Transaction, TransactionFilters, TransactionType } from "../domain/models/transactions";
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

    async deleteTransaction(accountId: string, transactionId: string, amount: number, type: TransactionType): Promise<void> {
        const {error: deleteError} = await this.supabase 
            .from('transactions')
            .delete()
            .eq("id", transactionId)
        if(deleteError) throw deleteError;

        const {data: account, error: accountError} = await this.supabase
            .from('accounts')
            .select('balance')
            .eq('id', accountId)
            .single();
        if(accountError) throw accountError;

        const delta = type === 'INCOME' ? -amount : amount;
        const {error: balanceError} = await this.supabase
            .from('accounts')
            .update({balance: account.balance + delta})
            .eq('id', accountId);

        if(balanceError) throw balanceError;
    }

    async createTransaction(payload: NewTransaction): Promise<void> {
       const {data: transaction, error: insertError} = await this.supabase
        .from('transactions')
        .insert(payload)
        .select()
        .single();
        if(insertError) throw insertError;

        const {data: account, error: fetchError} = await this.supabase
            .from('accounts')
            .select('balance')
            .eq('id', payload.account_id)
            .single();
        if(fetchError) throw fetchError;

        const delta = payload.type === 'INCOME' ? -payload.amount : payload.amount;
        const {error: balanceError} = await this.supabase 
            .from('accounts')
            .update({balance: account.balance + delta})
        if(balanceError) throw balanceError;
    }
    
    extractTransactionFromReceipt(base64Image: string, mimeType: string): Promise<ExtractedTransaction> {
        throw new Error("Method not implemented.");
    }

    extractTransactionFromVoice(base64Audio: string, mimeType: string): Promise<ExtractedTransaction> {
        throw new Error("Method not implemented.");
    }

}