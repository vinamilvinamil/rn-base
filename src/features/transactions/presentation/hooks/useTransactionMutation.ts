import { useSupabase } from "@/infrastructure/database/hooks/useSupabase";
import { createTransactionRepository } from "@/infrastructure/di";
import { queryFeatureKeys } from "@/infrastructure/query/keys";
import { useUser } from "@clerk/expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewTransaction, Transaction } from "../../domain/models/transactions";

export function useDeleteTransaction() {
    const { user } = useUser();
    const supabase = useSupabase();
    const transactioRepos = createTransactionRepository(supabase);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tx: Pick<Transaction, "id" | "account_id" | "amount" | "type">) => 
            transactioRepos.deleteTransaction(tx.account_id, tx.id, tx.amount, tx.type),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryFeatureKeys.TRANSACTION]
            })
            queryClient.invalidateQueries({
                queryKey: [queryFeatureKeys.ACCOUNT]
            })
        }
    })
}

export function useCreateTransaction() {
    const { user } = useUser();
    const supabase = useSupabase();
    const transactioRepos = createTransactionRepository(supabase);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: NewTransaction) => 
            transactioRepos.createTransaction(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryFeatureKeys.TRANSACTION]
            })
            queryClient.invalidateQueries({
                queryKey: [queryFeatureKeys.ACCOUNT]
            })
        }
    })
}