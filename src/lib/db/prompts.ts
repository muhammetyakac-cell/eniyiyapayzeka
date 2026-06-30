import prisma from "@/lib/prisma";

export async function getPromptsByTool(toolId: string, limit = 3) {
  return prisma.prompt.findMany({
    where: { toolId },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getPrompts(options?: {
  categorySlug?: string;
  page?: number;
  limit?: number;
}) {
  const { categorySlug, page = 1, limit = 24 } = options || {};
  const where = categorySlug
    ? { category: { slug: categorySlug } }
    : {};

  const [prompts, total] = await Promise.all([
    prisma.prompt.findMany({
      where,
      include: { tool: { select: { name: true, slug: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.prompt.count({ where }),
  ]);

  return { prompts, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getPromptById(id: string) {
  return prisma.prompt.findUnique({
    where: { id },
    include: { tool: { select: { name: true, slug: true } } },
  });
}
