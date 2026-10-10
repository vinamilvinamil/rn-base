import { CategoryKey } from "@/shared/constants/categories";


export type TransactionType = "INCOME" | "EXPENSE";
export type InputMethod = "MANUAL" | "RECEIPT_SCAN" | "VOICE";

export type Transaction = {
    account_id: string
    amount: number
    category: CategoryKey;
    created_at: string
    date: string
    description: string | null
    flag_reason: string | null
    id: string
    input_method: InputMethod
    is_flagged: boolean
    status: string
    type: TransactionType
    updated_at: string
    user_id: string
    voice_transcript: string | null
}

export interface TransactionFilters {
    type?: TransactionType | null;
    accountId?: string | null;
}

export type NewTransaction = {
    account_id: string
    amount: number
    category: CategoryKey;
    date: string
    description?: string | null
    input_method: InputMethod
    type: TransactionType
    user_id: string
    voice_transcript?: string | null
}

export type ExtractedTransaction = {
    type: 'EXPENSE' | 'INCOME' | null;
    amount: number | null;
    category: CategoryKey | null;
    description: string | null;
    date: string | null;
    trascript: string | null;
}
