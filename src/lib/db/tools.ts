import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

const CARD_SELECT = {
  id: true,
  slug: true,
  name: true,
  descriptionTr: true,
  pricingModel: true,
  starsCount: true,
  featured: true,
  categories: {
    select: { category: { select: { slug: true, nameTr: true } } },
  },
} satisfies Prisma.AiToolSelect;

export type ToolCardResult = Prisma.AiToolGetPayload<{ select: typeof CARD_SELECT }>;

export async function getToolBySlug(slug: string) {
  return prisma.aiTool.findUnique({
    where: { slug },
    select: {
      ...CARD_SELECT,
      websiteUrl: true,
      githubUrl: true,
      source: true,
      hardwareReq: true,
      metaTitle: true,
      metaDescription: true,
      useCases: true,
      bestFor: true,
      createdAt: true,
      updatedAt: true,
      prompts: {
        select: { id: true, title: true, useCase: true, promptText: true },
        take: 3,
      },
    },
  });
}

export async function getTools(options?: {
  categorySlug?: string;
  pricingModel?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { categorySlug, pricingModel, search, page = 1, limit = 24 } = options || {};
  const where: Prisma.AiToolWhereInput = {};

  if (categorySlug) {
    where.categories = { some: { category: { slug: categorySlug } } };
  }
  if (pricingModel) {
    where.pricingModel = pricingModel as Prisma.EnumPricingModelFilter["equals"];
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { descriptionTr: { contains: search, mode: "insensitive" } },
    ];
  }

  const [tools, total] = await Promise.all([
    prisma.aiTool.findMany({
      where,
      select: CARD_SELECT,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.aiTool.count({ where }),
  ]);

  return { tools, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getFeaturedTools(limit = 6) {
  return prisma.aiTool.findMany({
    where: { featured: true },
    select: CARD_SELECT,
    take: limit,
    orderBy: { starsCount: "desc" },
  });
}

export async function getSimilarTools(slug: string, limit = 4) {
  const tool = await prisma.aiTool.findUnique({
    where: { slug },
    select: { categories: { select: { categoryId: true } } },
  });

  if (!tool || tool.categories.length === 0) return [];

  const categoryIds = tool.categories.map((c: { categoryId: string }) => c.categoryId);

  return prisma.aiTool.findMany({
    where: {
      slug: { not: slug },
      categories: { some: { categoryId: { in: categoryIds } } },
    },
    select: CARD_SELECT,
    take: limit,
    orderBy: { starsCount: "desc" },
  });
}

export async function getToolCount() {
  return prisma.aiTool.count();
}
