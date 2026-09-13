import { useSupabase } from "@/infrastructure/database/hooks/useSupabase";
import { createAuthRepository } from "@/infrastructure/di";
import { queryKeys } from "@/infrastructure/query/keys";
import { useUser } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";

export function useAccountQuery() {
    const {user} = useUser();
    const supabase = useSupabase();
    const authRepo = createAuthRepository(supabase);

    return useQuery({
        queryKey: queryKeys.accounts(user?.id),
        queryFn: () => authRepo.getAccounts(user!.id),
        enabled: !!user
    })
}