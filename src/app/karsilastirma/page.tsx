import type { Metadata } from "next";
import Link from "next/link";
import { getAllComparisons } from "@/lib/db/comparisons";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yapay Zeka Araçları Karşılaştırmaları",
  description:
    "Popüler yapay zeka araçlarını yan yana karşılaştırın. ChatGPT vs Claude, Midjourney vs DALL-E ve daha fazlası.",
  alternates: { canonical: "/karsilastirma" },
};

export const revalidate = 86400;

export default async function KarsilastirmaPage() {
  let comparisons: Awaited<ReturnType<typeof getAllComparisons>> = [];
  try { comparisons = await getAllComparisons(); } catch {};

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Karşılaştırmalar" }]} />

      <h1 className="text-3xl font-bold mt-4 mb-8">
        Yapay Zeka Araçları Karşılaştırmaları
      </h1>

      {comparisons.length === 0 ? (
        <p className="text-muted-foreground">Henüz karşılaştırma bulunmuyor.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparisons.map((cmp) => (
            <Link
              key={cmp.id}
              href={`/karsilastirma/${cmp.slug}`}
              className="rounded-lg border p-6 hover:border-primary/50 transition-colors"
            >
              <h2 className="font-semibold text-lg">
                {cmp.toolA.name} vs {cmp.toolB.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                {cmp.toolA.name} ve {cmp.toolB.name} karşılaştırması.
                Özellikler, fiyatlandırma ve performans.
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
