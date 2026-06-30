import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    promptText: string;
    useCase: string | null;
    tool: { name: string; slug: string } | null;
  };
}

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Card className="card-hover flex flex-col justify-between h-full bg-card/60 backdrop-blur-xs border transition-all duration-300 relative overflow-hidden group animate-fade-in-up">
      {/* Visual top accent border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base font-bold line-clamp-1 text-foreground/90">
            {prompt.title}
          </CardTitle>
          {prompt.useCase && (
            <Badge variant="secondary" className="shrink-0 text-[10px] py-0.5 px-2 font-medium">
              {prompt.useCase}
            </Badge>
          )}
        </div>
        
        {prompt.tool && (
          <div className="mt-1">
            <Link
              href={`/araclar/${prompt.tool.slug}`}
              className="inline-flex items-center text-xs text-primary hover:underline font-semibold"
            >
              <span className="mr-1">🧰</span>
              {prompt.tool.name}
            </Link>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-0">
        <div className="bg-muted/30 p-3 rounded-lg border border-muted/50 relative">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-mono select-all">
            {prompt.promptText}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-muted/30">
          <Link
            href={`/promptlar/${prompt.id}`}
            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            Promptu Görüntüle
            <span>→</span>
          </Link>
          
          <div className="scale-90 origin-right">
            <CopyButton text={prompt.promptText} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
