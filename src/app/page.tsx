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
    <div className="relative min-h-screen overflow-hidden">
      {/* Visual background decorations */}
      <div className="absolute top-0 inset-x-0 h-[500px] hero-gradient pointer-events-none" />
      <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center py-20 md:py-28 max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-muted/40 backdrop-blur-xs text-xs font-semibold text-primary mb-6">
            ✨ Türkiye'nin Akıllı AI Platformu
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Türkiye&apos;nin En Kapsamlı
            <br />
            <span className="gradient-text">Yapay Zeka Araçları</span> Dizini
          </h1>
          
          <p className="mt-4 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {toolCount}+ yapay zeka aracını keşfedin, detaylı karşılaştırmalar yapın ve işinizi kolaylaştıracak en iyi promptları öğrenin.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/araclar"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-200"
            >
              Tüm Araçları Keşfet 🧰
            </Link>
            <Link
              href="/kategoriler"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl border bg-background/50 hover:bg-accent/80 backdrop-blur-xs px-8 text-sm font-semibold hover:-translate-y-0.5 transition-all duration-200"
            >
              Kategorilere Göz At 📂
            </Link>
          </div>
        </section>

        {/* Featured Tools Section */}
        {featuredTools.length > 0 && (
          <section className="py-16 border-t border-muted/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Öne Çıkan Yapay Zeka Araçları</h2>
                <p className="text-sm text-muted-foreground mt-1">Ekibimiz tarafından özenle seçilmiş en popüler araçlar</p>
              </div>
              <Link href="/araclar" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                Tümünü Gör <span>→</span>
              </Link>
            </div>
            <ToolGrid tools={featuredTools} />
          </section>
        )}

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="py-16 border-t border-muted/20">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Kategoriler</h2>
              <p className="text-sm text-muted-foreground mt-1">İhtiyacınıza en uygun yapay zeka aracını bulun</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/kategori/${cat.slug}`}
                  className="group rounded-2xl border p-5 bg-card/40 backdrop-blur-xs card-hover flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div>
                    <h3 className="font-bold text-base group-hover:text-primary transition-colors duration-200">
                      {cat.nameTr}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {cat.descriptionTr || "Kategoriye ait araçları listeleyin."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[11px] font-semibold bg-muted/60 py-1 px-2.5 rounded-lg border border-muted/30 text-muted-foreground">
                      {cat._count.tools} araç
                    </span>
                    <span className="text-xs text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 font-bold">
                      İncele →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
