import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSimilarTools } from "@/lib/db/tools";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { getPromptsByTool } from "@/lib/db/prompts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolCard } from "@/components/tools/tool-card";
import type { ToolCardData } from "@/types/tools";
import { sanitizeHtml } from "@/lib/utils/sanitize-html";

const PRICING_COLORS: Record<string, string> = {
  FREE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  FREEMIUM: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  PAID: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  OPEN_SOURCE: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
};

const PRICING_LABELS: Record<string, string> = {
  FREE: "Ücretsiz",
  FREEMIUM: "Freemium",
  PAID: "Ücretli",
  OPEN_SOURCE: "Açık Kaynak",
};

export const revalidate = 3600;

export default async function AracDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = await prisma.aiTool.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, name: true, descriptionTr: true,
      websiteUrl: true, githubUrl: true, pricingModel: true,
      hardwareReq: true, starsCount: true, source: true,
      featured: true, metaTitle: true, metaDescription: true,
      useCases: true, bestFor: true, createdAt: true, updatedAt: true,
      categories: { select: { category: { select: { slug: true, nameTr: true } } } },
      prompts: { select: { id: true, title: true, useCase: true, promptText: true }, take: 3 },
    },
  });
  if (!tool) notFound();

  const [prompts, similarTools] = await Promise.all([
    getPromptsByTool(tool.id, 3),
    getSimilarTools(slug, 4),
  ]);

  const faqSchema = prompts.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: (tool.useCases || []).slice(0, 3).map((uc) => ({
          "@type": "Question",
          name: `${tool.name} ile ${uc.toLowerCase()} mümkün mü?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Evet, ${tool.name} ile ${uc.toLowerCase()} mümkündür. Detaylı bilgi için aracın özelliklerini inceleyebilirsiniz.`,
          },
        })),
      }
    : null;

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: "AIApplication",
    operatingSystem: "Web",
    description: tool.metaDescription || tool.descriptionTr,
    offers: {
      "@type": "Offer",
      price: tool.pricingModel === "FREE" ? "0" : "Değişken",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Yapay Zeka Araçları", href: "/araclar" },
          { label: tool.name },
        ]}
      />

      <article>
        <div className="flex items-start gap-4 mt-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold">
              {tool.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Badge className={PRICING_COLORS[tool.pricingModel]}>
                {PRICING_LABELS[tool.pricingModel] || tool.pricingModel}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {tool.categories?.map((tc) => (
                  <a
                    key={tc.category.slug}
                    href={`/kategori/${tc.category.slug}`}
                    className="hover:text-foreground underline underline-offset-2"
                  >
                    {tc.category.nameTr}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {tool.descriptionTr && (
              <div
                className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-6 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(tool.descriptionTr) }}
              />
            )}

            {tool.useCases.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-bold mb-4">
                  {tool.name} Kullanım Alanları
                </h2>
                <ul className="space-y-2">
                  {tool.useCases.map((uc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 text-primary">•</span>
                      <span>{uc}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Özellikler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fiyat</span>
                  <span className="font-medium">
                    {PRICING_LABELS[tool.pricingModel] || tool.pricingModel}
                  </span>
                </div>
                {tool.hardwareReq && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Donanım</span>
                    <span className="font-medium text-right">
                      {tool.hardwareReq}
                    </span>
                  </div>
                )}
                {tool.starsCount !== null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">⭐ GitHub</span>
                    <span className="font-medium">
                      {tool.starsCount.toLocaleString("tr-TR")}
                    </span>
                  </div>
                )}
                {tool.bestFor && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">En uygun</span>
                    <span className="font-medium text-right">{tool.bestFor}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {tool.websiteUrl && (
              <a
                href={tool.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full h-10 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Web Sitesini Ziyaret Et
              </a>
            )}
          </aside>
        </div>

        {prompts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
              {tool.name} için En İyi Promptlar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {prompts.map((prompt) => (
                <Card key={prompt.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">{prompt.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {prompt.promptText}
                    </p>
                    <a
                      href={`/promptlar/${prompt.id}`}
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Promptu Gör
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {similarTools.length > 0 && (
          <section className="mt-12 mb-8">
            <h2 className="text-2xl font-bold mb-6">Benzer Araçlar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarTools.map((t) => (
                <ToolCard key={t.id} tool={t as unknown as ToolCardData} />
              ))}
            </div>
          </section>
        )}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await prisma.aiTool.findUnique({
    where: { slug },
    select: { slug: true, name: true, metaTitle: true, metaDescription: true },
  });
  if (!tool) return { title: "Araç Bulunamadı" };

  return {
    title: tool.metaTitle || `${tool.name} Nedir?`,
    description:
      tool.metaDescription ||
      `${tool.name} hakkında detaylı Türkçe inceleme. Özellikler, fiyatlandırma ve kullanım alanları.`,
    alternates: { canonical: `/araclar/${tool.slug}` },
    openGraph: {
      title: tool.metaTitle || `${tool.name} Nedir?`,
      description: tool.metaDescription || undefined,
      url: `/araclar/${tool.slug}`,
    },
  };
}
