import prisma from "@/lib/prisma";

export async function getAllCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { tools: true } } },
    orderBy: { nameTr: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { tools: true } } },
  });
}
