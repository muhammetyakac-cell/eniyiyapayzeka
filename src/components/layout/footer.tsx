import Link from "next/link";

const FOOTER_CATEGORIES = [
  { slug: "kodlama-yapay-zeka-araclari", label: "Kodlama" },
  { slug: "gorsel-uretimi-yapay-zeka-araclari", label: "Görsel Üretimi" },
  { slug: "metin-yazarligi-yapay-zeka-araclari", label: "Metin Yazarlığı" },
  { slug: "acik-kaynak-yapay-zeka-araclari", label: "Açık Kaynak" },
];

export function Footer() {
  return (
    <footer className="border-t mt-auto bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🤖</span>
              <span className="font-bold text-lg">
                eniyiyapay<span className="gradient-text">zeka</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Türkiye&apos;nin en kapsamlı yapay zeka araçları dizini. En iyi AI araçlarını keşfedin, karşılaştırın.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Sayfalar
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/araclar" className="text-muted-foreground hover:text-foreground transition-colors">
                  Araçlar
                </Link>
              </li>
              <li>
                <Link href="/kategoriler" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kategoriler
                </Link>
              </li>
              <li>
                <Link href="/promptlar" className="text-muted-foreground hover:text-foreground transition-colors">
                  Promptlar
                </Link>
              </li>
              <li>
                <Link href="/karsilastirma" className="text-muted-foreground hover:text-foreground transition-colors">
                  Karşılaştırmalar
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Kategoriler
            </h4>
            <ul className="space-y-3 text-sm">
              {FOOTER_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Hakkında
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Yapay zeka destekli içerik.</li>
              <li>Otomatik güncellenen veritabanı.</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} eniyiyapayzeka.com — Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Next.js ile geliştirildi</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span>Vercel&apos;de barındırılıyor</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
