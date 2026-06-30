import type { PricingModel, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { enrichTool } from "@/lib/ai-enrich";
import { toolSlugify } from "@/lib/utils/slugify";

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

const MAX_RETRIES = 3;

export async function GET() {
  const results = { retried: 0, succeeded: 0, failed: 0, cleaned: 0 };

  try {
    // 1. Clean up old failed jobs (30+ days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const oldJobs = await prisma.failedJob.deleteMany({
      where: {
        createdAt: { lte: thirtyDaysAgo },
        resolved: true,
      },
    });
    results.cleaned = oldJobs.count;

    // 2. Find unresolved failed jobs that haven't exceeded max retries
    const failedJobs = await prisma.failedJob.findMany({
      where: {
        resolved: false,
        retries: { lt: MAX_RETRIES },
      },
      orderBy: { createdAt: "asc" },
      take: 10, // Process max 10 per run to stay within execution limits
    });

    // 3. Retry enrichment for each failed job
    for (const job of failedJobs) {
      results.retried++;

      try {
        const rawData = job.rawData as Record<string, unknown>;
        const name = (rawData.name as string) || "";
        const slug = toolSlugify(name);

        // Check if it was already resolved by another process
        const alreadyExists = await prisma.aiTool.findUnique({
          where: { slug },
          select: { id: true },
        });

        if (alreadyExists) {
          await prisma.failedJob.update({
            where: { id: job.id },
            data: { resolved: true },
          });
          results.succeeded++;
          continue;
        }

        // Re-attempt enrichment
        const enriched = await enrichTool({
          name,
          description: (rawData.description as string) || undefined,
          websiteUrl: (rawData.websiteUrl as string) || undefined,
          githubUrl: (rawData.githubUrl as string) || undefined,
          starsCount: (rawData.starsCount as number) || undefined,
          source: (rawData.source as "GITHUB" | "HUGGINGFACE" | "PRODUCTHUNT" | "FUTURETOOLS" | "MANUAL") || "MANUAL",
        });

        // Create the tool
        await prisma.aiTool.create({
          data: {
            slug,
            name,
            descriptionTr: enriched.descriptionTr,
            websiteUrl: (rawData.websiteUrl as string) || null,
            githubUrl: (rawData.githubUrl as string) || null,
            starsCount: (rawData.starsCount as number) || null,
            source: (rawData.source as "GITHUB" | "HUGGINGFACE" | "PRODUCTHUNT" | "FUTURETOOLS" | "MANUAL") || "MANUAL",
            metaTitle: enriched.metaTitle || null,
            metaDescription: enriched.metaDescription || null,
            useCases: enriched.useCases || [],
            pricingModel: mapPricingModel(enriched.pricingModel),
            hardwareReq: enriched.hardwareReq || null,
            bestFor: enriched.bestFor || null,
          },
        });

        // Mark as resolved
        await prisma.failedJob.update({
          where: { id: job.id },
          data: { resolved: true },
        });

        results.succeeded++;

        // Delay between enrichments to respect Gemini rate limits
        await new Promise((r) => setTimeout(r, 4000));
      } catch (err) {
        results.failed++;

        // Increment retry counter
        await prisma.failedJob.update({
          where: { id: job.id },
          data: {
            retries: { increment: 1 },
            error: err instanceof Error ? err.message : String(err),
            // Auto-resolve if max retries reached
            resolved: job.retries + 1 >= MAX_RETRIES,
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
    message: "Retry pipeline completed",
    results,
  });
}
