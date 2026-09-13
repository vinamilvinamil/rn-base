
export type AccountType = "CASH" | "BANK" | "CREDIT_CARD" | "SAVINGS";

export type Account = {
    id: string;
    user_id: string;
    name: string;
    type: AccountType;
    balance: number;
    created_at: string;
    is_default: boolean;
}

