import prisma from "@/lib/prisma";

export async function getComparisonBySlug(slug: string) {
  return prisma.comparison.findUnique({
    where: { slug },
    include: {
      toolA: { select: { name: true, slug: true, descriptionTr: true, websiteUrl: true, pricingModel: true } },
      toolB: { select: { name: true, slug: true, descriptionTr: true, websiteUrl: true, pricingModel: true } },
    },
  });
}

export async function getAllComparisons() {
  return prisma.comparison.findMany({
    include: {
      toolA: { select: { name: true, slug: true } },
      toolB: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
