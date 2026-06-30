import * as React from "react";

interface ComparisonTableProps {
  toolAName: string;
  toolBName: string;
  table: Record<string, [string, string]>;
}

// Helper to determine if a value represents a positive/negative boolean feature
function renderCellValue(value: string) {
  const normalized = value.trim().toLowerCase();
  
  if (["evet", "var", "yes", "true", "1"].includes(normalized)) {
    return (
      <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
        <span className="text-sm">✅</span>
        {value}
      </span>
    );
  }
  
  if (["hayır", "yok", "no", "false", "0"].includes(normalized)) {
    return (
      <span className="inline-flex items-center gap-1.5 text-red-500 dark:text-red-400 font-medium">
        <span className="text-sm">❌</span>
        {value}
      </span>
    );
  }

  return value;
}

export function ComparisonTable({ toolAName, toolBName, table }: ComparisonTableProps) {
  return (
    <div className="w-full rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden animate-fade-in-up">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="text-left p-4 font-semibold text-muted-foreground w-1/3 min-w-[120px]">
                Özellik
              </th>
              <th className="text-left p-4 font-semibold text-primary w-1/3 min-w-[150px]">
                {toolAName}
              </th>
              <th className="text-left p-4 font-semibold text-primary w-1/3 min-w-[150px]">
                {toolBName}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {Object.entries(table).map(([key, [a, b]], i) => {
              // Convert camelCase or snake_case key to human readable sentence case
              const displayName = key
                .replace(/_/g, " ")
                .replace(/([A-Z])/g, " $1")
                .trim()
                .replace(/^\w/, (c) => c.toUpperCase());

              return (
                <tr
                  key={i}
                  className="hover:bg-accent/40 transition-colors duration-150 odd:bg-muted/10"
                >
                  <td className="p-4 font-medium text-foreground/80">
                    {displayName}
                  </td>
                  <td className="p-4 text-foreground/90">
                    {renderCellValue(a)}
                  </td>
                  <td className="p-4 text-foreground/90">
                    {renderCellValue(b)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
