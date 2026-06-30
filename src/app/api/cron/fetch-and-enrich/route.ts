import type { PricingModel, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { fetchGitHubTrending } from "@/lib/fetchers/github";
import { fetchHuggingFace } from "@/lib/fetchers/huggingface";
import { enrichTool } from "@/lib/ai-enrich";
import { toolSlugify } from "@/lib/utils/slugify";
import { deduplicateBatch } from "@/lib/utils/deduplicate";
import { rateLimitedBatch } from "@/lib/utils/rate-limit";
import type { RawToolData } from "@/types/tools";

function mapPricingModel(text: string): PricingModel {
  const lower = text.toLowerCase();
  if (lower.includes("açık") || lower.includes("open")) return "OPEN_SOURCE";
  if (lower.includes("freemium")) return "FREEMIUM";
  if (lower.includes("ücretli") || lower.includes("paid")) return "PAID";
  if (lower.includes("ücretsiz") || lower.includes("free")) return "FREE";
  return "FREE";
}

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET() {
  const results = { fetched: 0, enriched: 0, skipped: 0, failed: 0, errors: [] as string[] };

  try {
    // 1. Fetch from all sources in parallel
    const [githubTools, hfTools] = await Promise.allSettled([
      fetchGitHubTrending(),
      fetchHuggingFace(),
    ]);

    const allRawTools: RawToolData[] = [];

    if (githubTools.status === "fulfilled") {
      allRawTools.push(...githubTools.value);
    } else {
      results.errors.push(`GitHub fetch failed: ${githubTools.reason}`);
    }

    if (hfTools.status === "fulfilled") {
      allRawTools.push(...hfTools.value);
    } else {
      results.errors.push(`HuggingFace fetch failed: ${hfTools.reason}`);
    }

    results.fetched = allRawTools.length;

    // 2. Deduplicate against existing DB records
    const newTools = await deduplicateBatch(allRawTools);
    results.skipped = results.fetched - newTools.length;

    // 3. Enrich & save with rate limiting
    const { results: enrichedResults, errors: enrichErrors } = await rateLimitedBatch(
      newTools,
      async (rawTool) => {
        const slug = toolSlugify(rawTool.name);
        const enriched = await enrichTool(rawTool);

        // Connect to categories if specified
        const categoryConnect = rawTool.categorySlugs?.length
          ? {
              create: await Promise.all(
                rawTool.categorySlugs.map(async (catSlug) => {
                  const cat = await prisma.category.findUnique({ where: { slug: catSlug } });
                  return cat ? { categoryId: cat.id } : null;
                })
              ).then((results) => results.filter(Boolean) as { categoryId: string }[]),
            }
          : undefined;

        await prisma.aiTool.create({
          data: {
            slug,
            name: rawTool.name,
            descriptionTr: enriched.descriptionTr,
            websiteUrl: rawTool.websiteUrl || null,
            githubUrl: rawTool.githubUrl || null,
            starsCount: rawTool.starsCount || null,
            source: rawTool.source,
            metaTitle: enriched.metaTitle || null,
            metaDescription: enriched.metaDescription || null,
            useCases: enriched.useCases || [],
            pricingModel: mapPricingModel(enriched.pricingModel),
            hardwareReq: enriched.hardwareReq || null,
            bestFor: enriched.bestFor || null,
            categories: categoryConnect,
          },
        });

        return rawTool.name;
      },
      { concurrency: 3, delayMs: 4000 }
    );

    results.enriched = enrichedResults.length;

    // 4. Log failures to failed_jobs table
    for (const { item, error } of enrichErrors) {
      results.failed++;
      results.errors.push(`${item.name}: ${error.message}`);

      await prisma.failedJob.create({
        data: {
          source: item.source,
          rawData: item as unknown as Prisma.InputJsonValue,
          error: error.message,
        },
      });
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
