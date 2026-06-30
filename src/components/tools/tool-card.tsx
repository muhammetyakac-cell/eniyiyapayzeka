import { Badge } from "@/components/ui/badge";
import type { ToolCardData } from "@/types/tools";

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

interface ToolCardProps {
  tool: ToolCardData;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <a
      href={`/araclar/${tool.slug}`}
      className="group block rounded-lg border p-5 hover:border-primary/50 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
          {tool.name}
        </h3>
        <Badge
          className={`shrink-0 text-xs ${PRICING_COLORS[tool.pricingModel] || ""}`}
        >
          {PRICING_LABELS[tool.pricingModel] || tool.pricingModel}
        </Badge>
      </div>

      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
        {tool.descriptionTr || "Açıklama mevcut değil."}
      </p>

      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        {tool.starsCount !== null && (
          <span>⭐ {tool.starsCount.toLocaleString("tr-TR")}</span>
        )}
        {tool.categories?.length > 0 && (
          <span className="truncate">
            {tool.categories.map((tc) => tc.category.nameTr).join(", ")}
          </span>
        )}
      </div>
    </a>
  );
}
