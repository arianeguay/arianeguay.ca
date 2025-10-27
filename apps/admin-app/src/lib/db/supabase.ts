import { createClient } from '@supabase/supabase-js';

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const getBrowserSupabase = () => {
  if (!isSupabaseConfigured) return null;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Server-side Supabase client (with service role key)
export const getServiceSupabase = () => {
  if (!isSupabaseConfigured || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
