import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: "https://eniyiyapayzeka.com", priority: 1.0, changeFrequency: "daily" },
  { url: "https://eniyiyapayzeka.com/araclar", priority: 0.9, changeFrequency: "daily" },
  { url: "https://eniyiyapayzeka.com/kategoriler", priority: 0.8, changeFrequency: "weekly" },
  { url: "https://eniyiyapayzeka.com/promptlar", priority: 0.7, changeFrequency: "weekly" },
  { url: "https://eniyiyapayzeka.com/karsilastirma", priority: 0.7, changeFrequency: "weekly" },
  { url: "https://eniyiyapayzeka.com/blog", priority: 0.8, changeFrequency: "daily" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [tools, categories, comparisons, blogPosts, prompts] = await Promise.all([
      prisma.aiTool.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        select: { slug: true },
      }),
      prisma.comparison.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.prompt.findMany({
        select: { id: true, createdAt: true },
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
      ...blogPosts.map((bp) => ({
        url: `https://eniyiyapayzeka.com/blog/${bp.slug}`,
        priority: 0.8,
        changeFrequency: "weekly" as const,
        lastModified: bp.updatedAt,
      })),
      ...prompts.map((p) => ({
        url: `https://eniyiyapayzeka.com/promptlar/${p.id}`,
        priority: 0.7,
        changeFrequency: "monthly" as const,
        lastModified: p.createdAt,
      })),
    ];

    return [...STATIC_PAGES, ...dynamicPages];
  } catch {
    return STATIC_PAGES;
  }
}
