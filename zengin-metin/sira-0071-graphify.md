TITLE: Graphify: Kod Tabanınızı Sorgulanabilir Bilgi Grafiğine Dönüştüren Yapay Zeka Aracı
DATE: 2026-07-01
TAGS: graphify, yapay-zeka, kod-analizi, bilgi-grafigi, yazilim-gelistirme
---
Graphify, Y Combinator S26 destekli, GitHub'da 74.800'ün üzerinde yıldıza sahip bir yapay zeka aracı. Projenizi bir bilgi grafiğine (knowledge graph) dönüştürerek AI asistanlarınızın kod tabanınızı çok daha hızlı ve doğru anlamasını sağlıyor. Claude Code, Cursor, Codex, Gemini CLI ve 20'den fazla asistanda çalışan `/graphify .` komutuyla etkileşimli bir grafik, markdown raporu ve sorgulanabilir bir JSON dosyası oluşturuyor.

Kurulumu son derece basit: `uv tool install graphifyy` ile aracı yüklüyor, ardından `graphify install` ile kullandığınız asistana kaydediyorsunuz. Kod ayrıştırması tree-sitter AST çıkarımı ile yerelde yapılıyor ve hiçbir API çağrısı gerektirmiyor. Belgeler, PDF'ler, görseller ve videolar ise IDE oturumunuzun modeli üzerinden işleniyor. Yani yalnızca kod içeren bir projede API anahtarına bile ihtiyaç duymuyor.

Graphify'nin en büyük farkı, taşınabilirlik ve kapsam. Oluşturduğu grafik tek bir JSON dosyası olarak kaydediliyor, git'e eklenebiliyor, çevrimdışı sorgulanabiliyor ve tüm ekip tarafından paylaşılabiliyor. Ayrıca yalnızca kodu değil, SQL şemalarını, PDF'leri, makaleleri ve hatta transkript edilmiş videoları da aynı grafikte birleştiriyor. Bu, Cursor'un yerel indeksinin veya Claude Code'un dosya taramasının ulaşamadığı bir alan.

Graphify, AI kodlama asistanlarının en büyük sorunlarından birini çözüyor: her soruda dosyaları sırayla tarayıp bağlam harcamak yerine, asistana önce grafiğe bakmasını söyleyen bir yapılandırma dosyası yazıyor. Claude Code ve Gemini CLI'da bu otomatik olarak devreye girerken, Cursor'da bir kurallar dosyası ile aynı işlev sağlanıyor. 2026'nın en pratik ve az bilinen yazılım geliştirme araçlarından biri.
