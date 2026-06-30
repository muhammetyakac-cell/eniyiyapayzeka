import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAllCategories } from "@/lib/db/categories";
import { AdminDashboard } from "./admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // Fetch tools, categories, and statistics in parallel
  const [tools, categories, totalTools, totalFeatured] = await Promise.all([
    prisma.aiTool.findMany({
      include: {
        categories: {
          select: {
            category: {
              select: {
                id: true,
                nameTr: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    getAllCategories(),
    prisma.aiTool.count(),
    prisma.aiTool.count({ where: { featured: true } }),
  ]);

  const stats = {
    totalTools,
    totalCategories: categories.length,
    totalFeatured,
  };

  // Convert dates and types to match page expectations
  const serializedTools = tools.map((tool) => ({
    ...tool,
    pricingModel: tool.pricingModel as string,
  }));

  const serializedCategories = categories.map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    nameTr: cat.nameTr,
  }));

  return (
    <div className="container mx-auto px-4 py-12 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Admin Yönetim Paneli</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Hoş geldin, <span className="font-semibold text-foreground">{session.user.name || "Yönetici"}</span>
        </p>
      </div>

      <AdminDashboard
        initialTools={serializedTools}
        categories={serializedCategories}
        stats={stats}
      />
    </div>
  );
}
