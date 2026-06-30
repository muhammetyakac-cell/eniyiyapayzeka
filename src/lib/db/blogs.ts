import prisma from "@/lib/prisma";

export async function getBlogPosts(options: {
  page?: number;
  limit?: number;
  featured?: boolean;
} = {}) {
  const page = options.page || 1;
  const limit = options.limit || 6;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (options.featured !== undefined) {
    where.featured = options.featured;
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        tools: {
          select: {
            tool: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: {
      tools: {
        select: {
          tool: {
            select: {
              id: true,
              name: true,
              slug: true,
              descriptionTr: true,
              pricingModel: true,
              starsCount: true,
              featured: true,
              categories: {
                select: {
                  category: {
                    select: {
                      nameTr: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getBlogPostsByTool(toolId: string, limit = 3) {
  const associations = await prisma.blogPostTool.findMany({
    where: { toolId },
    take: limit,
    select: {
      blogPost: {
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          readTime: true,
          createdAt: true,
        },
      },
    },
  });

  return associations.map((a) => a.blogPost);
}
