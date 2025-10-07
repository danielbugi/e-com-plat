import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  return NextResponse.json(
    {
      session,
      hasSession: !!session,
      userRole: session?.user?.role || "none",
    },
    { status: 200 }
  );
}
