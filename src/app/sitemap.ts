import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: "https://eniyiyapayzeka.com", priority: 1.0, changeFrequency: "daily" },
  { url: "https://eniyiyapayzeka.com/araclar", priority: 0.9, changeFrequency: "daily" },
  { url: "https://eniyiyapayzeka.com/kategoriler", priority: 0.8, changeFrequency: "weekly" },
  { url: "https://eniyiyapayzeka.com/promptlar", priority: 0.7, changeFrequency: "weekly" },
  { url: "https://eniyiyapayzeka.com/karsilastirma", priority: 0.7, changeFrequency: "weekly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [tools, categories, comparisons] = await Promise.all([
      prisma.aiTool.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        select: { slug: true },
      }),
      prisma.comparison.findMany({
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const dynamicPages: MetadataRoute.Sitemap = [
      ...tools.map((t) => ({
        url: `https://eniyiyapayzeka.com/araclar/${t.slug}`,
        priority: 0.8,
        changeFrequency: "weekly" as const,
        lastModified: t.updatedAt,
      })),
      ...categories.map((c) => ({
        url: `https://eniyiyapayzeka.com/kategori/${c.slug}`,
        priority: 0.7,
        changeFrequency: "weekly" as const,
      })),
      ...comparisons.map((c) => ({
        url: `https://eniyiyapayzeka.com/karsilastirma/${c.slug}`,
        priority: 0.8,
        changeFrequency: "monthly" as const,
        lastModified: c.updatedAt,
      })),
    ];

    return [...STATIC_PAGES, ...dynamicPages];
  } catch {
    return STATIC_PAGES;
  }
}
