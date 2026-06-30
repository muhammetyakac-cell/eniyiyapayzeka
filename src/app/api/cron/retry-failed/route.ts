import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET() {
  const results = { retried: 0, failed: 0, cleaned: 0 };

  try {
    const oldJobs = await prisma.failedJob.findMany({
      where: {
        resolved: false,
        createdAt: { lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    });

    for (const job of oldJobs) {
      await prisma.failedJob.update({
        where: { id: job.id },
        data: { resolved: true },
      });
      results.cleaned++;
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error", results },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Cleanup completed",
    results,
  });
}
