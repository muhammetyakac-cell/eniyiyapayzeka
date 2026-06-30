"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface SearchResult {
  tools: Array<{ id: string; name: string; slug: string; descriptionTr: string | null }>;
  prompts: Array<{ id: string; title: string; promptText: string }>;
}

export function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = React.useState<SearchResult>({ tools: [], prompts: [] });
  const [loading, setLoading] = React.useState(false);

  // Toggle Command Dialog on keyboard shortcuts
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch results when debounced query changes
  React.useEffect(() => {
    if (!debouncedQuery) {
      setResults({ tools: [], prompts: [] });
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const runCommand = React.useCallback((callback: () => void) => {
    setOpen(false);
    callback();
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center justify-between w-full max-w-[200px] h-9 px-3 rounded-lg border text-muted-foreground bg-input/30 hover:bg-input/50 hover:text-foreground text-xs transition-all gap-4"
      >
        <span className="flex items-center gap-1.5">
          <SearchIcon className="size-3.5" />
          Ara...
        </span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Dialog */}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Yapay Zeka Arama Modalı"
        description="Araçları veya promptları arayın."
        className="sm:max-w-lg glass border shadow-2xl"
      >
        <CommandInput
          placeholder="Araç veya prompt ismi yazın..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="p-2">
          {loading && (
            <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              Aranıyor...
            </div>
          )}

          {!loading && !query && (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Aramaya başlamak için bir şeyler yazın.
            </div>
          )}

          {!loading && query && results.tools.length === 0 && results.prompts.length === 0 && (
            <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
          )}

          {!loading && results.tools.length > 0 && (
            <CommandGroup heading="Yapay Zeka Araçları">
              {results.tools.map((tool) => (
                <CommandItem
                  key={tool.id}
                  value={tool.name}
                  onSelect={() => {
                    runCommand(() => router.push(`/araclar/${tool.slug}`));
                  }}
                  className="hover:bg-accent rounded-lg cursor-pointer transition-colors"
                >
                  <span className="mr-2">🧰</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{tool.name}</span>
                    {tool.descriptionTr && (
                      <span className="text-[11px] text-muted-foreground line-clamp-1">
                        {tool.descriptionTr.replace(/<[^>]*>/g, "")}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!loading && results.prompts.length > 0 && (
            <CommandGroup heading="Hazır Promptlar">
              {results.prompts.map((prompt) => (
                <CommandItem
                  key={prompt.id}
                  value={prompt.title}
                  onSelect={() => {
                    runCommand(() => router.push(`/promptlar/${prompt.id}`));
                  }}
                  className="hover:bg-accent rounded-lg cursor-pointer transition-colors"
                >
                  <span className="mr-2">💬</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{prompt.title}</span>
                    <span className="text-[11px] text-muted-foreground line-clamp-1">
                      {prompt.promptText}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
