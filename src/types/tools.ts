export interface ToolCardData {
  id: string;
  slug: string;
  name: string;
  descriptionTr: string | null;
  pricingModel: string;
  starsCount: number | null;
  featured: boolean;
  categories: { category: { slug: string; nameTr: string } }[];
}

export interface EnrichedData {
  descriptionTr: string;
  metaTitle: string;
  metaDescription: string;
  useCases: string[];
  pricingModel: string;
  hardwareReq: string;
  bestFor: string;
}

export interface RawToolData {
  name: string;
  websiteUrl?: string;
  githubUrl?: string;
  description?: string;
  starsCount?: number;
  source: "GITHUB" | "HUGGINGFACE" | "PRODUCTHUNT" | "FUTURETOOLS" | "MANUAL";
  categorySlugs?: string[];
}
