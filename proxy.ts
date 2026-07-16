import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  // 1. Enforce admin protection first
  const adminSession = request.cookies.get("qusay_admin_session")?.value;
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith("/admin")) {
    if (url.pathname === "/admin/login") {
      if (adminSession === "true") {
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
    } else {
      if (adminSession !== "true") {
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
    }
  }

  // 2. Perform Supabase session refresh
  return await createClient(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
