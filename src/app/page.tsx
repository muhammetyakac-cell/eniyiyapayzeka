import { ToolGrid } from "@/components/tools/tool-grid";
import { getFeaturedTools, getToolCount } from "@/lib/db/tools";
import type { ToolCardData } from "@/types/tools";
import { getAllCategories } from "@/lib/db/categories";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredTools: ToolCardData[] = [];
  let toolCount = 0;
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];

  try {
    [featuredTools, toolCount, categories] = await Promise.all([
      getFeaturedTools(6),
      getToolCount(),
      getAllCategories(),
    ]);
  } catch {
    // Database not available yet
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Türkiye&apos;nin En Kapsamlı
          <br />
          <span className="text-primary">Yapay Zeka Araçları</span> Dizini
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {toolCount}+ yapay zeka aracını keşfedin, karşılaştırın ve en iyi promptlarla kullanmaya başlayın.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/araclar"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tüm Araçları Keşfet
          </Link>
          <Link
            href="/kategoriler"
            className="inline-flex h-11 items-center justify-center rounded-md border px-8 text-sm font-medium hover:bg-accent"
          >
            Kategorilere Göz At
          </Link>
        </div>
      </section>

      {featuredTools.length > 0 && (
        <section className="py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Öne Çıkan Araçlar</h2>
            <Link href="/araclar" className="text-sm text-primary hover:underline">
              Tümünü Gör
            </Link>
          </div>
          <ToolGrid tools={featuredTools} />
        </section>
      )}

      {categories.length > 0 && (
        <section className="py-12">
          <h2 className="text-2xl font-bold mb-6">Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="rounded-lg border p-4 hover:border-primary/50 transition-colors"
              >
                <h3 className="font-semibold">{cat.nameTr}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {cat._count.tools} araç
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
