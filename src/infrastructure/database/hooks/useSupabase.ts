import { useAuth } from '@clerk/expo';
import { useMemo } from 'react';
import { createClerkSupbaseClient } from '../supabase';

export function useSupabase() {
    const { getToken } = useAuth();

    const client = useMemo(
        () => createClerkSupbaseClient(() => getToken())
        , []);
    return client;
}