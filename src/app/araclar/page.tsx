import type { Metadata } from "next";
import { ToolGrid } from "@/components/tools/tool-grid";
import { getTools } from "@/lib/db/tools";
import type { ToolCardData } from "@/types/tools";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yapay Zeka Araçları",
  description:
    "En popüler yapay zeka araçlarını keşfedin. ChatGPT, Claude, Midjourney ve yüzlerce AI aracının detaylı Türkçe incelemeleri.",
  alternates: { canonical: "/araclar" },
};

export const revalidate = 3600;

export default async function AracPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; kategori?: string; fiyat?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  let result: { tools: ToolCardData[]; total: number; page: number; totalPages: number } = { tools: [], total: 0, page: 1, totalPages: 0 };

  try {
    result = await getTools({
      categorySlug: params.kategori,
      pricingModel: params.fiyat,
      search: params.q,
      page,
    });
  } catch {
    // Database not available yet
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Yapay Zeka Araçları" }]} />

      <h1 className="text-3xl font-bold mt-4 mb-8">Yapay Zeka Araçları</h1>

      <div className="mb-6">
        <p className="text-muted-foreground">
          {result.total} araç bulundu — Sayfa {result.page}/{result.totalPages}
        </p>
      </div>

      <ToolGrid tools={result.tools} />

      {result.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <a
                key={p}
                href={`/araclar?page=${p}`}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm border ${
                  p === page
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-accent"
                }`}
              >
                {p}
              </a>
            )
          )}
        </div>
      )}
    </div>
  );
}
