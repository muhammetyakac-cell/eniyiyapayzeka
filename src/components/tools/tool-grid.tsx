import type { ToolCardData } from "@/types/tools";
import { ToolCard } from "@/components/tools/tool-card";

interface ToolGridProps {
  tools: ToolCardData[];
}

export function ToolGrid({ tools }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Henüz araç bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
