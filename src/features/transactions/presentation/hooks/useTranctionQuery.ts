import { useSupabase } from "@/infrastructure/database/hooks/useSupabase";
import { createTransactionRepository } from "@/infrastructure/di";
import { queryKeys } from "@/infrastructure/query/keys";
import { useUser } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";
import { TransactionFilters } from "../../domain/models/transactions";

export function useTransactionQuery(filters: TransactionFilters = {}) {
    const {user} = useUser();
    const supabase = useSupabase();
    const transactionRepo = createTransactionRepository(supabase);

    return useQuery({
        queryKey: queryKeys.transactions(user?.id, filters),
        queryFn: () => transactionRepo.getTransactions(user!.id, filters),
        enabled: !!user
    })
}