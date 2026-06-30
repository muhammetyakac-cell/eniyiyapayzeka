import Link from "next/link";

const NAV_ITEMS = [
  { href: "/araclar", label: "Araçlar" },
  { href: "/kategoriler", label: "Kategoriler" },
  { href: "/promptlar", label: "Promptlar" },
  { href: "/karsilastirma", label: "Karşılaştırma" },
];

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          eniyiyapayzeka<span className="text-primary">.com</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
