import type { Metadata } from "next";
import Link from "next/link";
import { getPrompts } from "@/lib/db/prompts";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PromptCard } from "@/components/prompts/prompt-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yapay Zeka Promptları",
  description:
    "En iyi yapay zeka promptlarını keşfedin. ChatGPT, Claude, Midjourney ve daha fazlası için optimize edilmiş promptlar.",
  alternates: { canonical: "/promptlar" },
};

export const revalidate = 3600;

export default async function PromptlarPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const urlPage = Number(params.page) || 1;
  let result: Awaited<ReturnType<typeof getPrompts>> = { prompts: [], total: 0, page: 1, totalPages: 0 };
  try { result = await getPrompts({ page: urlPage }); } catch {};
  const { prompts, total, totalPages, page } = result;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Promptlar" }]} />

      <h1 className="text-3xl font-bold mt-4 mb-8">Yapay Zeka Promptları</h1>

      {prompts.length === 0 ? (
        <p className="text-muted-foreground">Henüz prompt bulunmuyor.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/promptlar?page=${p}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm border ${
                p === page
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-accent"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
