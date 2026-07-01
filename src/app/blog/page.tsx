import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/db/blogs";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yapay Zeka Blogu & İncelemeler",
  description:
    "Yapay zeka araçları hakkında detaylı Türkçe incelemeler, karşılaştırma kılavuzları, rehberler ve en son yapay zeka haberleri.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  let result: Awaited<ReturnType<typeof getBlogPosts>> = { posts: [], total: 0, page: 1, limit: 6, totalPages: 0 };

  try {
    result = await getBlogPosts({ page, limit: 6 });
  } catch (err) {
    console.error("Failed to load blog posts:", err);
  }

  const { posts, totalPages } = result;

  const getVisiblePages = (current: number, total: number) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    
    if (current <= 3) return [1, 2, 3, 4, '...', total - 1, total];
    if (current >= total - 2) return [1, 2, '...', total - 3, total - 2, total - 1, total];
    
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 inset-x-0 h-[400px] hero-gradient pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Breadcrumb items={[{ label: "Blog" }]} />

        {/* Hero header */}
        <section className="py-12 md:py-16 text-center max-w-2xl mx-auto">
          <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold text-primary mb-4">
            📚 eniyiyapayzeka Akademi
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Yapay Zeka Rehberleri & <span className="gradient-text">İncelemeler</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Popüler yapay zeka araçları hakkında detaylı Türkçe rehberler, karşılaştırmalı analizler ve kullanım ipuçları.
          </p>
        </section>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-card/40 border rounded-2xl p-8 glass max-w-md mx-auto">
            <span className="text-4xl">✍️</span>
            <h3 className="text-lg font-bold mt-4">Henüz yazı bulunmuyor</h3>
            <p className="text-sm text-muted-foreground mt-2">
              İçerik editörlerimiz şu an yeni incelemeler ve rehberler hazırlıyor. Çok yakında buradayız!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="card-hover flex flex-col justify-between h-full bg-card/60 backdrop-blur-xs border transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span role="img" aria-label="calendar">📅</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    <span>⏱️ {post.readTime} dk okuma</span>
                  </div>
                  
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-4 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Associated tools tags */}
                  {post.tools && post.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {post.tools.map((t) => (
                        <Badge key={t.tool.id} variant="outline" className="text-[10px] font-medium py-0.5 px-2 bg-muted/30">
                          🧰 {t.tool.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-muted/30">
                    <span className="text-xs text-muted-foreground">Yazar: {post.author}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      Devamını Oku <span>→</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-12">
            {visiblePages.map((p, index) => {
              if (p === "...") {
                return (
                  <span key={`dots-${index}`} className="px-2 text-muted-foreground">
                    ...
                  </span>
                );
              }
              return (
                <Link
                  key={p}
                  href={`/blog?page=${p}`}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm border transition-colors ${
                    p === page
                      ? "bg-primary text-primary-foreground border-primary font-semibold shadow-sm"
                      : "hover:bg-accent hover:text-accent-foreground bg-background/50 border-input"
                  }`}
                >
                  {p}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
