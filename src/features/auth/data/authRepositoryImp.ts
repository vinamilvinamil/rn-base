import { Database } from "@/infrastructure/database/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { AuthRepository } from "../domain/authRepository";
import { Account } from "../domain/models/accounts";

export class AuthRepositoryImp implements AuthRepository {
    constructor(private supabase: SupabaseClient<Database>) { }

    async getAccounts(userId: string): Promise<Account[]> {
        const { data, error } = await this.supabase
            .from('accounts')
            .select('*')
            .eq('user_id', userId)
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as Account[];
    }

}