import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;
  // Try non-prefixed vars first (server-side, available at build+runtime in Vercel)
  let url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  let key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("[supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars");
    return null;
  }
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}
