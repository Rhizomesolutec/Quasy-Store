import { type NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16.2 can 404 valid App Router pages if this proxy clones
 * the request (the old Supabase session-refresh pattern).
 * Keep it as a passthrough. Admin auth stays in app/admin layouts.
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}
