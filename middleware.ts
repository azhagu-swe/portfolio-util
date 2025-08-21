import { isBot } from "@/lib/isBot";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map(origin => origin.trim().replace(/\/$/, "")) // 🚀 strip trailing /
  .filter(Boolean);

if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

export function middleware(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") ?? "";
  const origin = (req.headers.get("origin") ?? "").replace(/\/$/, ""); // 🚀 normalize

  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      headers: {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "null",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": req.headers.get("access-control-request-headers") || "Content-Type, Authorization",
      },
    });
  }

  if (isBot(userAgent)) {
    return new NextResponse("Bot traffic ignored", { status: 403 });
  }

  const isAllowed = allowedOrigins.includes(origin);
  if (!isAllowed) {
    console.warn(`Unauthorized access from origin: ${origin}`);
    return new NextResponse("Unauthorized access", { status: 403 });
  }

  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export const config = {
  matcher: ["/api/visitors/:path*"],
};
