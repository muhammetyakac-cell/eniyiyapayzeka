import prisma from "@/lib/prisma";
import type { RawToolData } from "@/types/tools";
import { toolSlugify } from "@/lib/utils/slugify";

/**
 * Check if a tool already exists in the database by slug.
 * Returns true if the tool should be skipped (already exists).
 */
export async function existsBySlug(name: string): Promise<boolean> {
  const slug = toolSlugify(name);
  const existing = await prisma.aiTool.findUnique({
    where: { slug },
    select: { id: true },
  });
  return !!existing;
}

/**
 * Check if a tool already exists by GitHub URL.
 * Handles URL normalization (trailing slashes, .git suffix).
 */
export async function existsByGithubUrl(githubUrl: string): Promise<boolean> {
  if (!githubUrl) return false;

  const normalized = normalizeGithubUrl(githubUrl);
  const existing = await prisma.aiTool.findFirst({
    where: { githubUrl: normalized },
    select: { id: true },
  });
  return !!existing;
}

/**
 * Normalize a GitHub URL for comparison.
 * Strips trailing slashes, .git suffix, and ensures https://.
 */
function normalizeGithubUrl(url: string): string {
  return url
    .trim()
    .replace(/\/+$/, "")
    .replace(/\.git$/, "")
    .replace(/^http:\/\//, "https://")
    .toLowerCase();
}

/**
 * Deduplicate a batch of raw tools:
 * 1. Remove duplicates within the batch (by normalized name slug)
 * 2. Remove tools that already exist in DB (by slug)
 * 3. Remove tools that already exist in DB (by GitHub URL)
 */
export async function deduplicateBatch(
  tools: RawToolData[]
): Promise<RawToolData[]> {
  // Step 1: In-batch dedup by slug
  const seen = new Set<string>();
  const uniqueInBatch: RawToolData[] = [];

  for (const tool of tools) {
    const slug = toolSlugify(tool.name);
    if (seen.has(slug)) continue;
    seen.add(slug);
    uniqueInBatch.push(tool);
  }

  // Step 2 & 3: DB dedup (slug + GitHub URL)
  const newTools: RawToolData[] = [];

  for (const tool of uniqueInBatch) {
    const slugExists = await existsBySlug(tool.name);
    if (slugExists) continue;

    if (tool.githubUrl) {
      const urlExists = await existsByGithubUrl(tool.githubUrl);
      if (urlExists) continue;
    }

    newTools.push(tool);
  }

  return newTools;
}
