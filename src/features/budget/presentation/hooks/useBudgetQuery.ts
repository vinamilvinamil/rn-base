import { useSupabase } from "@/infrastructure/database/hooks/useSupabase";
import { createBudgetRepository } from "@/infrastructure/di";
import { queryKeys } from "@/infrastructure/query/keys";
import { useUser } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";

export function useBudgetQuery() {
    const {user} = useUser();
    const supabase = useSupabase();
    const budgetRepo = createBudgetRepository(supabase);

    return useQuery({
        queryKey: queryKeys.budget(user?.id),
        queryFn: () => budgetRepo.getBudget(user!.id),
        enabled: !!user
    })
}