import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getBlogPostBySlug } from "@/lib/db/blogs";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolCard } from "@/components/tools/tool-card";
import type { ToolCardData } from "@/types/tools";
import { sanitizeHtml } from "@/lib/utils/sanitize-html";

export const dynamic = "force-dynamic";

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  // JSON-LD Schema
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    publisher: {
      "@type": "Organization",
      name: "eniyiyapayzeka.com",
      logo: {
        "@type": "ImageObject",
        url: "https://eniyiyapayzeka.com/images/og-default.png",
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <article className="mt-6">
        {/* Post Header */}
        <header className="mb-8 border-b pb-6 max-w-4xl">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <Badge variant="secondary" className="px-2.5 py-0.5 font-medium">
              Akademi
            </Badge>
            <span>
              📅{" "}
              {post.createdAt.toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span>⏱️ {post.readTime} dakika okuma</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary border border-primary/20">
              ✍️
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Yayınlayan Yazar</p>
              <p className="text-sm font-semibold text-foreground">{post.author}</p>
            </div>
          </div>
        </header>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div
              className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:leading-relaxed prose-p:mb-4 prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.contentTr) }}
            />
          </div>

          {/* Related tools sidebar */}
          {post.tools && post.tools.length > 0 && (
            <aside className="space-y-6 lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <Card className="glass border shadow-sm">
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      İlişkili Yapay Zeka Araçları
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {post.tools.map((t) => (
                      <div key={t.tool.id} className="scale-95 hover:scale-100 transition-transform origin-center">
                        <ToolCard tool={t.tool as unknown as ToolCardData} />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Promotional banner card */}
                <Card className="p-5 border bg-primary/5 border-primary/15 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-[-10%] right-[-10%] w-24 h-24 rounded-full bg-primary/10 blur-xl group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-2xl">🤖</span>
                  <h4 className="font-bold text-sm mt-3 text-primary">eniyiyapayzeka.com</h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Yapay zeka araçlarını keşfedin, karşılaştırın ve en uygun fiyatlı AI çözümlerini hemen bulun.
                  </p>
                </Card>
              </div>
            </aside>
          )}
        </div>
      </article>

      {/* JSON-LD Schema markup injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { slug: true, title: true, excerpt: true, metaTitle: true, metaDescription: true },
  });

  if (!post) return { title: "Yazı Bulunamadı" };

  return {
    title: post.metaTitle || `${post.title} | Blog`,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: "article",
      url: `/blog/${post.slug}`,
    },
  };
}
