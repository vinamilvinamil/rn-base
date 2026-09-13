import { Transaction, TransactionFilters } from "./models/transactions";

export interface TransactionRepository {
    getTransactions(userId: string, filters: TransactionFilters): Promise<Transaction[]>;
}