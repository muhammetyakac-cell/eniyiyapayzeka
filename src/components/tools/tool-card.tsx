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
      className="group block rounded-2xl border p-5 bg-card/40 backdrop-blur-xs card-hover relative overflow-hidden transition-all duration-300 animate-fade-in-up"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">
          {tool.name}
        </h3>
        <Badge
          className={`shrink-0 text-[10px] font-semibold py-0.5 px-2.5 rounded-full border shadow-none ${PRICING_COLORS[tool.pricingModel] || ""}`}
        >
          {PRICING_LABELS[tool.pricingModel] || tool.pricingModel}
        </Badge>
      </div>

      <p className="mt-2.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
        {tool.descriptionTr || "Açıklama mevcut değil."}
      </p>

      <div className="mt-4 pt-3 border-t border-muted/30 flex items-center justify-between text-xs text-muted-foreground">
        {tool.starsCount !== null ? (
          <span className="flex items-center gap-1 font-medium bg-muted/50 py-1 px-2.5 rounded-lg border border-muted/30">
            ⭐ {tool.starsCount.toLocaleString("tr-TR")}
          </span>
        ) : (
          <span />
        )}
        {tool.categories?.length > 0 && (
          <span className="truncate max-w-[150px] font-medium text-[11px] text-primary/80">
            {tool.categories[0].category.nameTr}
          </span>
        )}
      </div>
    </a>
  );
}
