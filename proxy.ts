import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

/**
 * Keep this proxy narrowly scoped.
 * A broad matcher in Next.js 16.2.x can make valid App Router pages
 * (including /admin/login) return 404 in development.
 *
 * Admin auth is enforced in app/admin route layouts instead.
 */
export async function proxy(request: NextRequest) {
  return await createClient(request);
}

export const config = {
  matcher: [
    "/account",
    "/account/:path*",
    "/payment",
    "/payment/:path*",
  ],
};
