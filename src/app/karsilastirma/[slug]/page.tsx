import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComparisonBySlug } from "@/lib/db/comparisons";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ComparisonTable } from "@/components/comparison/comparison-table";

export const dynamic = "force-dynamic";

export default async function KarsilastirmaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) notFound();

  const content =
    typeof comparison.contentTr === "string"
      ? JSON.parse(comparison.contentTr)
      : comparison.contentTr;

  const table = content?.table as Record<string, [string, string]> | undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Karşılaştırmalar", href: "/karsilastirma" },
          { label: `${comparison.toolA.name} vs ${comparison.toolB.name}` },
        ]}
      />

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {comparison.toolA.name} vs {comparison.toolB.name}
      </h1>
      <p className="text-muted-foreground mb-8">
        2026 güncel karşılaştırma
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="card-hover transition-all">
          <CardHeader>
            <CardTitle>
              <a
                href={`/araclar/${comparison.toolA.slug}`}
                className="hover:text-primary transition-colors font-bold"
              >
                {comparison.toolA.name}
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {comparison.toolA.descriptionTr?.replace(/<[^>]*>/g, "").slice(0, 200)}...
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover transition-all">
          <CardHeader>
            <CardTitle>
              <a
                href={`/araclar/${comparison.toolB.slug}`}
                className="hover:text-primary transition-colors font-bold"
              >
                {comparison.toolB.name}
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {comparison.toolB.descriptionTr?.replace(/<[^>]*>/g, "").slice(0, 200)}...
            </p>
          </CardContent>
        </Card>
      </div>

      {table && Object.keys(table).length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Özellik Karşılaştırması</h2>
          <ComparisonTable
            toolAName={comparison.toolA.name}
            toolBName={comparison.toolB.name}
            table={table}
          />
        </section>
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
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) return { title: "Karşılaştırma Bulunamadı" };

  return {
    title: `${comparison.toolA.name} vs ${comparison.toolB.name} Karşılaştırması`,
    description: `${comparison.toolA.name} ve ${comparison.toolB.name} karşılaştırması. Hangisi daha iyi? Özellikler, fiyat ve performans.`,
    alternates: { canonical: `/karsilastirma/${comparison.slug}` },
  };
}
