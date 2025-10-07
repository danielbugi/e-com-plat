import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // For now, allow all access
  // We'll check auth on the server side in admin pages
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
