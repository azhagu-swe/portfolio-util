import { isBot } from "@/lib/isBot";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

export function middleware(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") ?? "";
  const origin = req.headers.get("origin") ?? "";
  const referer = req.headers.get("referer") ?? "";

  if (isBot(userAgent)) {
    return new NextResponse("Bot traffic ignored", { status: 403 });
  }

  const isAllowed =
    allowedOrigins.some(o => origin.startsWith(o)) ||
    allowedOrigins.some(o => referer.startsWith(o));

  if (!isAllowed) {
    return new NextResponse("Unauthorized access", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/visitors", "/api/visitors/:path*"],
};
