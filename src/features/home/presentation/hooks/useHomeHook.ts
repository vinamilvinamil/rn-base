import { useAccountQuery } from "@/features/auth/presentation/hooks/useAuthQuery";
import { useBudgetQuery } from "@/features/budget/presentation/hooks/useBudgetQuery";
import { Transaction } from "@/features/transactions/domain/models/transactions";
import { useTransactionQuery } from "@/features/transactions/presentation/hooks/useTranctionQuery";
import { getCategoryConfig } from "@/shared/constants/categories";
import { useUserStore } from "@/shared/store/useStore";
import { isSameMonth } from 'date-fns';
import { useMemo } from "react";

export const useHomeHook = () => {
    const currency = useUserStore(state => state.currency);
    const {
        data: accounts = [],
        isLoading: accountIsLoading,
        isRefetching: accountIsRefetching,
        refetch: refetchAccount
    } = useAccountQuery();

    const {
        data: transactions = [],
        isLoading: transactionIsLoading,
        isRefetching: transactionIsRefetching,
        refetch: refetchTransaction
    } = useTransactionQuery();

    const {
        data: budget = null,
        refetch: refetchBudget
    } = useBudgetQuery();

    const loading = accountIsLoading || transactionIsLoading;
    const refreshing = accountIsRefetching || transactionIsRefetching;
    const totalBalance = useMemo(() => {
        return accounts.reduce((sum, account) => sum + account.balance, 0);
    }, [accounts])

    const monthTransaction = useMemo(() => {
        const now = new Date();
        return transactions.filter(tx => isSameMonth(new Date(tx.date), now));
    }, [transactions])

    const monthIncome = useMemo(() => {
        return monthTransaction
            .filter(tx => tx.type === 'INCOME')
            .reduce((sum, tx) => sum + tx.amount, 0);
    }, [monthTransaction])

    const monthExpense = useMemo(() => {
        return monthTransaction
            .filter(tx => tx.type === 'EXPENSE')
            .reduce((sum, tx) => sum + tx.amount, 0);
    }, [monthTransaction])

    const recentTransactions = useMemo(() => {
        return transactions.slice(0, 5);
    }, [transactions])

    const expenseBreakdown = useMemo(() => {
        const map: Record<string, number> = {};
        monthTransaction
            .filter(tx => tx.type === 'EXPENSE')
            .forEach(tx => {
                map[tx.category] = (map[tx.category] ?? 0) + tx.amount;
            });
        return Object.entries(map)
            .sort((a, b) => b[1] - a[1])
            .map(([category, amount]) => ({
                category: category as Transaction['category'],
                amount,
                color: getCategoryConfig(category as any).color
            }))
    }, [monthTransaction])

    const onRefresh = () => {
        refetchAccount();
        refetchTransaction();
        refetchBudget();
    }

    return {
        currency,
        totalBalance,
        monthTransaction,
        loading,
        refreshing,
        budget,
        monthIncome,
        monthExpense,
        recentTransactions,
        expenseBreakdown,
        onRefresh
    }
}