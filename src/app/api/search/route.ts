import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json({ tools: [], prompts: [] });
  }

  const [tools, prompts] = await Promise.all([
    prisma.aiTool.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { descriptionTr: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { slug: true, name: true },
      take: 10,
    }),
    prisma.prompt.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { promptText: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, title: true, tool: { select: { name: true } } },
      take: 5,
    }),
  ]);

  return NextResponse.json({ tools, prompts });
}
