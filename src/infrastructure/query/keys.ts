import { TransactionFilters } from "@/features/transactions/domain/models/transactions";
export const queryFeatureKeys = {
    ACCOUNT: "accounts",
    TRANSACTION: "transactions",
    BUDGE: "budget"
} as const;

export const queryKeys = {
    accounts: (userId?: string) => [queryFeatureKeys.ACCOUNT, userId] as const,
    transactions: (userId?: string, filters: TransactionFilters = {}) => [queryFeatureKeys.TRANSACTION, userId, filters] as const,
    budget: (userId?: string) => [queryFeatureKeys.BUDGE, userId] as const
};