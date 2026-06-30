import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPromptById } from "@/lib/db/prompts";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";

export const revalidate = 3600;

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = await getPromptById(id);
  if (!prompt) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Promptlar", href: "/promptlar" },
          { label: prompt.title },
        ]}
      />

      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mt-4 mb-2">{prompt.title}</h1>
        {prompt.tool && (
          <p className="text-muted-foreground mb-6">
            Araç:{" "}
            <a
              href={`/araclar/${prompt.tool.slug}`}
              className="text-primary hover:underline"
            >
              {prompt.tool.name}
            </a>
          </p>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <pre
              id="prompt-text"
              className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md"
            >
              {prompt.promptText}
            </pre>
            <div className="mt-4">
              <CopyButton text={prompt.promptText} />
            </div>
          </CardContent>
        </Card>

        {prompt.useCase && (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-3">Kullanım Alanı</h2>
            <p className="text-muted-foreground">{prompt.useCase}</p>
          </section>
        )}
      </article>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const prompt = await getPromptById(id);
  if (!prompt) return { title: "Prompt Bulunamadı" };

  return {
    title: `${prompt.title} - Yapay Zeka Promptu`,
    description: `${prompt.title} promptu. ${prompt.useCase || "Yapay zeka için optimize edilmiş prompt."}`,
    alternates: { canonical: `/promptlar/${prompt.id}` },
  };
}
