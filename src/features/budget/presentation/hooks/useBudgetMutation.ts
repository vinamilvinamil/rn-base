import { useSupabase } from "@/infrastructure/database/hooks/useSupabase";
import { createBudgetRepository } from "@/infrastructure/di";
import { queryFeatureKeys } from "@/infrastructure/query/keys";
import { useUser } from "@clerk/expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpsertBudget() {
    const {user} = useUser();
    const supabase = useSupabase();
    const budgetRepo = createBudgetRepository(supabase);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (amount: number) => budgetRepo.upsertBudget(user!.id, amount),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryFeatureKeys.BUDGE]
            })
        }
    })
}