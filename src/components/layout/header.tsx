"use client";

import Link from "next/link";
import { useState } from "react";
import { SearchCommand } from "@/components/layout/search-command";

const NAV_ITEMS = [
  { href: "/araclar", label: "Araçlar", icon: "🧰" },
  { href: "/kategoriler", label: "Kategoriler", icon: "📂" },
  { href: "/promptlar", label: "Promptlar", icon: "💬" },
  { href: "/karsilastirma", label: "Karşılaştırma", icon: "⚖️" },
  { href: "/blog", label: "Blog", icon: "📚" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl" role="img" aria-label="logo">🤖</span>
          <span className="text-lg font-bold tracking-tight">
            eniyiyapay
            <span className="gradient-text">zeka</span>
            <span className="text-muted-foreground">.com</span>
          </span>
        </Link>

        {/* Desktop Navigation & Search */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-all duration-200 group"
              >
                <span className="mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
          <SearchCommand />
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <SearchCommand />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-accent transition-colors animate-fade-in-up"
            aria-label="Menü"
            aria-expanded={mobileOpen}
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span
                className={`block h-0.5 bg-foreground rounded-full transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-foreground rounded-full transition-all duration-300 ${
                  mobileOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-foreground rounded-full transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-80 border-t" : "max-h-0"
        }`}
      >
        <nav className="container mx-auto px-4 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
