import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
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