import { AuthRepositoryImp } from "@/features/auth/data/authRepositoryImp";
import { AuthRepository } from "@/features/auth/domain/authRepository";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";

export const createAuthRepository= (supabase: SupabaseClient<Database>)  : AuthRepository=> {
    return new AuthRepositoryImp(supabase);
}