"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface Category {
  id: string;
  slug: string;
  nameTr: string;
}

interface ToolFiltersProps {
  categories: Category[];
}

const PRICING_OPTIONS = [
  { value: "all", label: "Tüm Fiyatlandırmalar" },
  { value: "FREE", label: "Ücretsiz" },
  { value: "FREEMIUM", label: "Freemium" },
  { value: "PAID", label: "Ücretli" },
  { value: "OPEN_SOURCE", label: "Açık Kaynak" },
];

export function ToolFilters({ categories }: ToolFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state initialized from URL search params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("kategori") || "all");
  const [selectedPricing, setSelectedPricing] = useState(searchParams.get("fiyat") || "all");

  const debouncedSearchQuery = useDebounce(searchQuery, 350);

  // Sync state changes back to the URL parameters
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Page reset to 1 when filters change
    params.set("page", "1");

    if (debouncedSearchQuery) {
      params.set("q", debouncedSearchQuery);
    } else {
      params.delete("q");
    }

    if (selectedCategory && selectedCategory !== "all") {
      params.set("kategori", selectedCategory);
    } else {
      params.delete("kategori");
    }

    if (selectedPricing && selectedPricing !== "all") {
      params.set("fiyat", selectedPricing);
    } else {
      params.delete("fiyat");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [debouncedSearchQuery, selectedCategory, selectedPricing, pathname, router, searchParams]);

  return (
    <div className="w-full glass p-5 rounded-2xl border shadow-sm mb-8 space-y-4 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            🔍
          </span>
          <input
            type="text"
            placeholder="Yapay zeka aracı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border bg-background/50 hover:bg-background/80 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Select */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border bg-background/50 hover:bg-background/80 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none appearance-none"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.nameTr}
              </option>
            ))}
          </select>
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">
            ▼
          </span>
        </div>

        {/* Pricing Select */}
        <div className="relative">
          <select
            value={selectedPricing}
            onChange={(e) => setSelectedPricing(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border bg-background/50 hover:bg-background/80 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none appearance-none"
          >
            {PRICING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">
            ▼
          </span>
        </div>
      </div>

      {isPending && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse pl-1">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
          Sonuçlar güncelleniyor...
        </div>
      )}
    </div>
  );
}
