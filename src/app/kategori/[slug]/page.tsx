import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/db/categories";
import { getTools } from "@/lib/db/tools";
import { ToolGrid } from "@/components/tools/tool-grid";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const revalidate = 86400;

export default async function KategoriPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { tools } = await getTools({ categorySlug: slug });

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Kategoriler", href: "/kategoriler" },
          { label: category.nameTr },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">{category.nameTr}</h1>
      {category.descriptionTr && (
        <p className="text-muted-foreground mb-8">{category.descriptionTr}</p>
      )}

      <p className="text-sm text-muted-foreground mb-6">
        {category._count.tools} araç bulundu
      </p>

      <ToolGrid tools={tools} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Kategori Bulunamadı" };

  return {
    title: `${category.nameTr} - Yapay Zeka Araçları`,
    description:
      category.descriptionTr ||
      `En iyi ${category.nameTr.toLowerCase()} yapay zeka araçlarını keşfedin.`,
    alternates: { canonical: `/kategori/${category.slug}` },
  };
}
