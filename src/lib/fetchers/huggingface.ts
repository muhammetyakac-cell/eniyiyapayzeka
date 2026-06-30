import type { RawToolData } from "@/types/tools";

const HF_API = "https://huggingface.co/api/models";

export async function fetchHuggingFace(): Promise<RawToolData[]> {
  const res = await fetch(
    `${HF_API}?sort=downloads&direction=-1&limit=20&filter=transformers`
  );

  if (!res.ok) throw new Error(`HuggingFace API error ${res.status}`);

  const models = await res.json();

  return (models || []).map((model: Record<string, unknown>) => ({
    name: model.modelId as string,
    description: (model.pipeline_tag as string) || "",
    websiteUrl: `https://huggingface.co/${model.modelId}`,
    githubUrl: `https://huggingface.co/${model.modelId}`,
    starsCount: model.likes as number,
    source: "HUGGINGFACE" as const,
    categorySlugs: ["acik-kaynak-yapay-zeka-araclari"],
  }));
}
