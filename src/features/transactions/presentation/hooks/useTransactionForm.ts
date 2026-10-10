import { useAccountQuery } from '@/features/auth/presentation/hooks/useAuthQuery';
import { exportTransactionsToCsv } from '@/shared/util/utils';
import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { TransactionType } from '../../domain/models/transactions';
import { currentMonthDays, dayKey, TRANSACTION_FILTERS } from '../screens/TransactionScreen';
import { useTransactionQuery } from './useTranctionQuery';
import { useDeleteTransaction } from './useTransactionMutation';

export function useTransactionForm() {
    const [activeFilter, setActiveFilter] = useState<typeof TRANSACTION_FILTERS[number]>('All');
    const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [exporting, setExporting] = useState(false);

    const typeFilter: TransactionType | null =
        activeFilter === 'Income'
            ? 'INCOME'
            : activeFilter === 'Expense'
                ? 'EXPENSE'
                : null;

    const {
        data: transactions = [],
        isLoading: transactionLoading,
        isRefetching: transactionRefetching,
        isError: transactionError,
        refetch: refetchTransactions
    } = useTransactionQuery({ type: typeFilter, accountId: activeAccountId });

    const {
        data: accounts = [],
        refetch: refetchAccounts
    } = useAccountQuery();

    const { mutateAsync: removeTransaction } = useDeleteTransaction();

    const loading = transactionLoading;
    const refetching = transactionRefetching;
    const error = transactionError;

    const loadData = () => {
        refetchTransactions();
        refetchAccounts();
    }

    const handleExport = async () => {
        if (exporting) return;
        setExporting(true);
        try {
            const { count } = await exportTransactionsToCsv(transactions);
            if (count == 0) {
                Alert.alert(
                    "Nothing to export",
                    "No transactions in the export window"
                );
            }
        } catch (error) {
            console.error('Export failed', error);
            Alert.alert("Error", "Couldn't export transactions");
        } finally {
            setExporting(false);
        }
    };

    const filteredTransactions = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return transactions;
        return transactions.filter((tx) =>
            tx.description?.toLowerCase().includes(q)
            || tx.category.toLowerCase().includes(q));
    }, [transactions, search])

    const dailyIncomeExpense = useMemo(() => {
        const days = currentMonthDays();
        return days.flatMap(({ key, label }) => {
            const income = transactions
                .filter(
                    (tx) => tx.type === 'INCOME' && dayKey(new Date(tx.date)) === key
                )
                .reduce((sum, tx) => sum + tx.amount, 0);
            const expense = transactions
                .filter(
                    (tx) => tx.type === 'EXPENSE' && dayKey(new Date(tx.date)) === key
                )
                .reduce((sum, tx) => sum + tx.amount, 0)
            return [
                {value: income, label, frontColor: '#3DDC84'},
                {value: expense, frontColor: '#FF6B4A'}
            ]
        })

    }, [transactions])

    return {
        loading,
        refetching,
        error,
        exporting,
        search,
        activeFilter,
        setActiveFilter,
        setSearch,
        activeAccountId,
        setActiveAccountId,
        accounts,
        filteredTransactions,
        dailyIncomeExpense,
        loadData,
        handleExport,
        removeTransaction
    }
}
