/**
 * lib/supabase-server.ts — server-side Supabase client
 * Use this in Server Components, Route Handlers, and Server Actions.
 * Uses the service role key for admin operations (bypasses RLS).
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from Server Component — cookies can't be set,
            // but this is fine if auth isn't needed in this render.
          }
        },
      },
    }
  );
}

/**
 * Admin client — uses service role key, bypasses RLS.
 * Only use server-side for operations that require elevated privileges
 * (e.g., writing to notifications table, creating staff records).
 */
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
