import type { PricingModel, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { fetchGitHubTrending } from "@/lib/fetchers/github";
import { fetchHuggingFace } from "@/lib/fetchers/huggingface";
import { enrichTool } from "@/lib/ai-enrich";
import { toolSlugify } from "@/lib/utils/slugify";

function mapPricingModel(text: string): PricingModel {
  if (text.toLowerCase().includes("ücretsiz")) return "FREE";
  if (text.toLowerCase().includes("freemium")) return "FREEMIUM";
  if (text.toLowerCase().includes("ücretli")) return "PAID";
  if (text.toLowerCase().includes("açık")) return "OPEN_SOURCE";
  return "FREE";
}

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET() {
  const results = { fetched: 0, enriched: 0, failed: 0, errors: [] as string[] };

  try {
    const githubTools = await fetchGitHubTrending();
    const hfTools = await fetchHuggingFace();

    const allTools = [...githubTools, ...hfTools];

    for (const rawTool of allTools) {
      try {
        const slug = toolSlugify(rawTool.name);

        const exists = await prisma.aiTool.findUnique({ where: { slug } });
        if (exists) continue;

        const enriched = await enrichTool(rawTool);

        await prisma.aiTool.create({
          data: {
            slug,
            name: rawTool.name,
            descriptionTr: enriched.descriptionTr,
            websiteUrl: rawTool.websiteUrl,
            githubUrl: rawTool.githubUrl,
            starsCount: rawTool.starsCount,
            source: rawTool.source,
            metaTitle: enriched.metaTitle || null,
            metaDescription: enriched.metaDescription || null,
            useCases: enriched.useCases || [],
            pricingModel: mapPricingModel(enriched.pricingModel),
            hardwareReq: enriched.hardwareReq || null,
            bestFor: enriched.bestFor || null,
          },
        });

        results.enriched++;
      } catch (err) {
        results.failed++;
        const errorMsg = err instanceof Error ? err.message : String(err);
        results.errors.push(`${rawTool.name}: ${errorMsg}`);

        await prisma.failedJob.create({
          data: {
            source: rawTool.source,
            rawData: rawTool as unknown as Prisma.InputJsonValue,
            error: errorMsg,
          },
        });
      }
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error", results },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Pipeline completed",
    results,
  });
}
