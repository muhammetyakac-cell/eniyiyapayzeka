import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-3">eniyiyapayzeka.com</h3>
            <p className="text-sm text-muted-foreground">
              Türkiye&apos;nin en kapsamlı yapay zeka araçları dizini.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Sayfalar</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/araclar" className="hover:text-foreground">Araçlar</Link></li>
              <li><Link href="/kategoriler" className="hover:text-foreground">Kategoriler</Link></li>
              <li><Link href="/promptlar" className="hover:text-foreground">Promptlar</Link></li>
              <li><Link href="/karsilastirma" className="hover:text-foreground">Karşılaştırmalar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Kategoriler</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/kategori/kodlama-yapay-zeka-araclari" className="hover:text-foreground">Kodlama</Link></li>
              <li><Link href="/kategori/gorsel-uretimi-yapay-zeka-araclari" className="hover:text-foreground">Görsel Üretimi</Link></li>
              <li><Link href="/kategori/metin-yazarligi-yapay-zeka-araclari" className="hover:text-foreground">Metin Yazarlığı</Link></li>
              <li><Link href="/kategori/acik-kaynak-modeller" className="hover:text-foreground">Açık Kaynak</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Hakkında</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>© 2026 Tüm hakları saklıdır.</li>
              <li>Yapay zeka destekli içerik.</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
