

export type TransactionType = "INCOME" | "EXPENSE";
export type InputMethod = "MANUAL" | "RECEIPT_SCAN" | "VOICE";

export type Transaction = {
    account_id: string
    amount: number
    category: string
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
