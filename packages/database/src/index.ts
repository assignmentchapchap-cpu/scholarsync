export * from './types';
export * from './client';
export * from './server';

import { createClient } from '@supabase/supabase-js';

/**
 * Create a Supabase admin client with service role key
 * Used for server-side operations that bypass RLS
 */
export const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
};
