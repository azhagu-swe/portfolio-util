import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_ORIGINS =
  process.env.ALLOWED_ORIGINS?.split(",").map(o => o.trim()) || [];

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin") || "";
    const referer = req.headers.get("referer") || "";

    const isAllowed =
      ALLOWED_ORIGINS.some(o => origin.startsWith(o)) ||
      ALLOWED_ORIGINS.some(o => referer.startsWith(o));

    if (!isAllowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visitor = await prisma.visitor.findFirst({
      where: { ip, lastVisitAt: { gte: today } },
    });

    if (!visitor) {
      await prisma.visitor.upsert({
        where: { ip },
        update: {
          visitCount: { increment: 1 },
          lastVisitAt: new Date(),
        },
        create: {
          ip,
          userAgent,
          visitCount: 1,
        },
      });
    }

    const uniqueVisitors = await prisma.visitor.count();
    const totalVisits = await prisma.visitor.aggregate({
      _sum: { visitCount: true },
    });

    return NextResponse.json({
      uniqueVisitors,
      totalVisits: totalVisits._sum.visitCount || 0,
    });
  } catch (error) {
    console.error("Visitor API Error:", error);
    return NextResponse.json(
      { error: "Failed to track visitor" },
      { status: 500 }
    );
  }
}
