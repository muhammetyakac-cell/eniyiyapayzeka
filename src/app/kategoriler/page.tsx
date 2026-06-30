import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/db/categories";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kategoriler",
  description:
    "Yapay zeka araçlarını kategorilere göre keşfedin. Kodlama, görsel üretimi, metin yazarlığı ve daha fazlası.",
  alternates: { canonical: "/kategoriler" },
};

export const revalidate = 86400;

export default async function KategorilerPage() {
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  try { categories = await getAllCategories(); } catch {};

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Kategoriler" }]} />

      <h1 className="text-3xl font-bold mt-4 mb-8">Kategoriler</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/kategori/${cat.slug}`}
            className="rounded-lg border p-6 hover:border-primary/50 transition-colors"
          >
            <h2 className="font-semibold text-lg">{cat.nameTr}</h2>
            {cat.descriptionTr && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {cat.descriptionTr}
              </p>
            )}
            <p className="text-sm text-primary mt-3">
              {cat._count.tools} araç
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
