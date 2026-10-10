import { ExtractedTransaction, NewTransaction, Transaction, TransactionFilters, TransactionType } from "./models/transactions";

export interface TransactionRepository {
    getTransactions(userId: string, filters: TransactionFilters): Promise<Transaction[]>;

    deleteTransaction(accountId: string, transactionId: string, amount: number, type: TransactionType) : Promise<void>;

    createTransaction(payload: NewTransaction) : Promise<void>;

    extractTransactionFromReceipt(
        base64Image: string,
        mimeType: string
    ) : Promise<ExtractedTransaction>;

    extractTransactionFromVoice(
        base64Audio: string,
        mimeType: string
    ) : Promise<ExtractedTransaction>;
}