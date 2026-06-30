import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComparisonBySlug } from "@/lib/db/comparisons";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card>
          <CardHeader>
            <CardTitle>
              <a
                href={`/araclar/${comparison.toolA.slug}`}
                className="hover:text-primary"
              >
                {comparison.toolA.name}
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {comparison.toolA.descriptionTr?.slice(0, 200)}...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <a
                href={`/araclar/${comparison.toolB.slug}`}
                className="hover:text-primary"
              >
                {comparison.toolB.name}
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {comparison.toolB.descriptionTr?.slice(0, 200)}...
            </p>
          </CardContent>
        </Card>
      </div>

      {table && Object.keys(table).length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Özellik Karşılaştırması</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium">Özellik</th>
                  <th className="text-left p-3 font-medium">
                    {comparison.toolA.name}
                  </th>
                  <th className="text-left p-3 font-medium">
                    {comparison.toolB.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(table).map(([key, [a, b]], i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3 font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </td>
                    <td className="p-3">{a}</td>
                    <td className="p-3">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
