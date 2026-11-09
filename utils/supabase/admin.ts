import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client with the service role key.
 * Never import this into client components.
 */
export function createAdminClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin credentials are not configured");
  }

  if (serviceRoleKey.startsWith("sb_publishable_")) {
    throw new Error("Supabase admin client requires the service-role key, not the public anon key");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
