import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing supbase evn vars')
}

export function createClerkSupbaseClient(getToken: () => Promise<string | null>) {
    return createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
        async accessToken() {
            return getToken();
        },
    })
}