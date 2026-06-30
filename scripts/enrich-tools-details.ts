import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting tool details enrichment...");

  const updates = [
    {
      slug: "chatgpt-nedir",
      metaTitle: "ChatGPT Nedir, Nasıl Kullanılır? | Detaylı Kullanıcı Rehberi",
      metaDescription: "OpenAI ChatGPT rehberi. GPT-4o model özellikleri, özel GPT yapımı, gelişmiş prompt teknikleri ve günlük üretkenlik iş akışları detayları.",
      useCases: [
        "Metin yazımı ve e-posta otomasyonu",
        "Karmaşık kod blokları yazma ve refactor etme",
        "Dosya analizi ve PDF özetleme",
        "Özel GPT botları oluşturma",
        "Çok dilli çeviri ve dil öğrenimi"
      ],
      descriptionTr: `
        <h2>ChatGPT Nedir ve Nasıl Çalışır?</h2>
        <p>OpenAI tarafından geliştirilen <strong>ChatGPT</strong>, üretken yapay zeka (Generative AI) dünyasını başlatan öncü sohbet asistanıdır. En güncel sürümü olan <strong>GPT-4o (omni)</strong> modeli sayesinde sadece metin değil, ses, görsel ve dosya girdilerini de gerçek zamanlı olarak işleme yeteneğine sahiptir. ChatGPT, kullanıcıların sorduğu soruları mantık süzgecinden geçirerek, bağlamı kaybetmeden insan benzeri yanıtlar üretir.</p>

        <h2>Kapsamlı Kullanım Modellemesi ve İş Akışları</h2>
        <p>ChatGPT'yi profesyonel iş akışlarınıza entegre etmek için şu gelişmiş modellemelerden yararlanabilirsiniz:</p>
        <ul>
          <li><strong>Özel GPT'ler (Custom GPTs):</strong> Kendi verilerinizi, talimatlarınızı ve API bağlantılarınızı ekleyerek tamamen şirketiniz veya kişisel işiniz için çalışan özel asistanlar inşa edebilirsiniz. Örneğin, şirketin İK yönergeleriyle eğitilmiş bir "İK Asistanı" veya kod standartlarınızı denetleyen bir "Code Reviewer" yapabilirsiniz.</li>
          <li><strong>Gelişmiş Veri Analizi (Advanced Data Analysis):</strong> ChatGPT'ye büyük CSV veya Excel dosyaları yükleyerek Python kodları eşliğinde veri analizi yaptırabilir, anlık grafikler çizdirebilir ve regresyon modelleri kurdurabilirsiniz.</li>
          <li><strong>Bellek Özelliği (Memory):</strong> Sohbetler sırasında ChatGPT'ye "Bana yazılım projelerimde TypeScript kullandığımı unutma" diyerek, sonraki tüm sohbetlerde bu bağlama göre yanıt vermesini sağlayabilirsiniz.</li>
        </ul>

        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <p>ChatGPT'yi en verimli şekilde kullanmaya başlamak için şu adımları izleyin:</p>
        <ol>
          <li><strong>Hesap Oluşturma:</strong> chatgpt.com adresine giderek ücretsiz bir hesap oluşturun. Ücretsiz sürüm GPT-4o-mini ve sınırlı GPT-4o hakkı sunar.</li>
          <li><strong>Prompt Tasarımı (Rol Tanımlama):</strong> Sorularınızı sormadan önce yapay zekaya bir rol verin. Örn: <em>"Sen deneyimli bir SEO editörüsün. Bana..."</em></li>
          <li><strong>Sıralı Komutlar:</strong> Tek bir promptta tüm işi istemek yerine, adım adım ilerleyin. Önce taslak isteyin, ardından taslağı genişletmesini talep edin.</li>
        </ol>

        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> İnanılmaz hızlı multimodal desteği, devasa entegrasyon ekosistemi (DALL-E, web arama, python sandbox), güçlü Türkçe dil hakimiyeti.</p>
        <p><strong>Dezavantajlar:</strong> Bazen bilgi uydurma (hallucination) eğilimi, yoğun saatlerde hız düşüşleri, uzun kod tabanlarını bir bütün olarak anlamakta Claude'a göre biraz daha geride kalması.</p>
      `
    },
    {
      slug: "claude-3-5-sonnet-nedir",
      metaTitle: "Claude 3.5 Sonnet İncelemesi | En İyi Kod ve Yazım Yapay Zekası",
      metaDescription: "Anthropic Claude 3.5 Sonnet rehberi. Artifacts arayüzü, gelişmiş mantık yürütme, doğal Türkçe yazım yeteneği ve teknik analizi.",
      useCases: [
        "Doğal Türkçe blog ve pazarlama metinleri yazma",
        "Karmaşık kod analizi ve hata ayıklama",
        "Uzun döküman ve akademik makale analizi",
        "Görsel arayüz tasarımlarını koda dönüştürme",
        "Stratejik iş planlaması ve mantık yürütme"
      ],
      descriptionTr: `
        <h2>Claude 3.5 Sonnet: Güvenlik ve Mantıkta Zirve</h2>
        <p>Anthropic tarafından geliştirilen <strong>Claude 3.5 Sonnet</strong>, yapay zeka dünyasında özellikle yazılım geliştiriciler ve içerik üreticileri arasında en yüksek memnuniyete sahip dil modelidir. Şirketin "Güvenli Yapay Zeka" (Constitutional AI) felsefesiyle tasarlanan model, insan değerlerine uyumlu, etik ve son derece mantıklı yanıtlar üretir.</p>

        <h2>Devrim Yaratan 'Artifacts' Arayüzü</h2>
        <p>Claude'un kullanımını benzersiz kılan en büyük yenilik **Artifacts** özelliğidir. Bir kod yazdırmak, SVG çizim yaptırmak veya interaktif bir React bileşeni oluşturmak istediğinizde, Claude bu çıktıyı sadece metin olarak vermez. Ekranın sağ tarafında açılan interaktif bir pencerede (Artifacts) kodu çalıştırır ve anında görsel önizlemesini sunar. Bu sayede:</p>
        <ul>
          <li>Yazdığı basit HTML/CSS/JS oyunları anında tarayıcıda oynayabilirsiniz.</li>
          <li>Oluşturduğu veri tablolarını ve infografikleri dinamik olarak inceleyebilirsiniz.</li>
          <li>React ve Tailwind bileşenlerinin tasarımını canlı canlı görebilirsiniz.</li>
        </ul>

        <h2>Profesyonel İş Akışları ve Projeler (Projects)</h2>
        <p>Claude Pro kullanıcıları, **Projects** özelliğini kullanarak kendi çalışma alanlarını oluşturabilir. Çalışma alanına projenizin kaynak kodlarını, API dökümanlarını ve marka kılavuzunu yükleyerek, sonraki tüm sorularda sadece bu verilere sadık kalarak yanıt vermesini sağlayabilirsiniz. Bu, özellikle büyük kod tabanlarında çalışırken mükemmel bir verimlilik sağlar.</p>

        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Mükemmel edebi Türkçe kalitesi (uydurma kelimeler kullanmaz), 200.000 tokenlik devasa bağlam penceresi, üst düzey kodlama mantığı, Artifacts görsel önizlemesi.</p>
        <p><strong>Dezavantajlar:</strong> İnternet erişiminin doğrudan entegre olmaması (arama özellikleri sınırlıdır), dahili bir görsel üretim motorunun (DALL-E benzeri) bulunmaması.</p>
      `
    },
    {
      slug: "cursor-nedir",
      metaTitle: "Cursor IDE Nedir, Nasıl Kullanılır? | Yapay Zeka Kod Editörü",
      metaDescription: "Yapay zeka entegre kod editörü Cursor rehberi. Composer kullanımı, custom .cursorrules tanımlama, otomatik kod yazma ve terminal entegrasyonu.",
      useCases: [
        "Tüm kod tabanını tarayarak hata bulma",
        "Composer ile çoklu dosyalarda otonom değişiklikler yapma",
        "Terminal komutlarını yapay zekaya yazdırma",
        "Figma tasarımlarını doğrudan koda dökme",
        "Otomatik docstring ve birim testler yazma"
      ],
      descriptionTr: `
        <h2>Cursor: Yapay Zeka ile Yeniden Düşünülmüş IDE</h2>
        <p><strong>Cursor</strong>, klasik VS Code editörünün tüm özelliklerini koruyarak, yapay zekayı editörün çekirdeğine entegre eden yeni nesil bir yazılım geliştirme ortamıdır (IDE). Eklenti olarak kurulan yardımcıların aksine Cursor, projenizin tüm klasör yapısını, dosyalarını ve git geçmişini indeksler (semantik arama) ve kod yazarken tam bağlamı korur.</p>

        <h2>Gelişmiş Kodlama Modellemesi: Composer</h2>
        <p>Cursor'ın en güçlü aracı olan <strong>Composer (Ctrl+I)</strong>, sadece aktif dosyada değil, tüm projedeki dosyaları aynı anda düzenleyebilen otonom bir kodlama asistanıdır. Örneğin, "Projedeki tüm API çağrılarına yeni bir loglama mekanizması ekle" dediğinizde Composer; servis dosyalarını, tipleri ve utils fonksiyonlarını bulur, hepsini paralel olarak günceller ve değişiklikleri size onay için sunar.</p>

        <h2>Custom Rules: .cursorrules Kullanımı</h2>
        <p>Projenizin kök dizinine ekleyeceğiniz bir <code>.cursorrules</code> dosyası ile Cursor'ın projenize özel davranmasını sağlayabilirsiniz. Bu dosyaya:</p>
        <pre><code>- React bileşenlerinde her zaman Tailwind kullan.
- TypeScript tiplerini her zaman types/ klasöründe tanımla.
- Değişiklik yaptıktan sonra terminalde 'npm run lint' çalıştır.</code></pre>
        <p>gibi kurallar yazarak Cursor'ın üreteceği kod standartlarını %100 kontrol altında tutabilirsiniz.</p>

        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> VS Code eklentileriyle tam uyumluluk, çok hızlı indeksleme, Claude 3.5 Sonnet ve o1 modellerine doğrudan erişim, terminale entegre yapay zeka yardımı.</p>
        <p><strong>Dezavantajlar:</strong> Ücretsiz planda hızlı sorgu sınırları, tamamen yapay zekaya bağımlı kalındığında kod tabanında ufak mantık kaymalarına yol açabilmesi.</p>
      `
    },
    {
      slug: "deepseek-nedir",
      metaTitle: "DeepSeek R1 Nedir, Nasıl Çalışır? | Akıl Yürütme LLM Kılavuzu",
      metaDescription: "DeepSeek R1 akıl yürütme modeli teknik özellikleri. Açık kaynak kod yapısı, düşünme adımları (Chain of Thought) ve local kurulum detayları.",
      useCases: [
        "İleri düzey matematik ve fizik problemleri çözme",
        "Karmaşık yazılım algoritmaları tasarlama ve doğrulama",
        "Şirket içi verilerle yerel sunucularda LLM çalıştırma",
        "Akıl yürütme (reasoning) yetenekli yapay zeka ajanları kurma",
        "Düşük bütçeli yapay zeka API entegrasyonları"
      ],
      descriptionTr: `
        <h2>DeepSeek R1: Yapay Zekada Akıl Yürütme Devrimi</h2>
        <p>Çin merkezli <strong>DeepSeek</strong> tarafından geliştirilen <strong>R1</strong> modeli, yapay zekada "akıl yürütme" (reasoning) dönemini başlatan en güçlü açık kaynaklı büyük dil modelidir. OpenAI'nin kapalı kaynaklı o1 modeline rakip olarak geliştirilen DeepSeek R1, yanıt vermeden önce karmaşık düşünme zincirleri (Chain of Thought) oluşturur.</p>

        <h2>Düşünme Zinciri Nasıl Çalışır?</h2>
        <p>R1'e bir soru sorduğunuzda, sistem cevabı anında yazmaya başlamaz. Önce problemin alt adımlarını analiz eder, olası çözüm yollarını değerlendirir ve kendi hatalarını fark edip düzeltir. Arayüzde bu süreci <em>"Düşünme Süreci (Thought Process)"</em> başlığı altında saniye saniye okuyabilirsiniz. Bu yöntem, özellikle matematik, mantık bulmacaları ve karmaşık yazılım algoritmalarında hata oranını sıfıra yakın bir seviyeye indirir.</p>

        <h2>Açık Kaynak ve Yerel Kurulum Esnekliği</h2>
        <p>DeepSeek R1'in en büyük gücü, model ağırlıklarının tamamen açık olarak paylaşılmasıdır. 671 milyar parametrelik tam modelin yanı sıra, ev bilgisayarlarında çalışabilecek 8B, 14B, 32B ve 70B gibi distile edilmiş sürümleri de mevcuttur. Bu sayede şirketler, hassas verilerini buluta göndermeden kendi sunucularında DeepSeek R1 çalıştırabilmektedir.</p>

        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Tamamen açık kaynak (MIT Lisansı), rakipsiz mantık ve kodlama başarısı, inanılmaz ucuz API fiyatlandırması.</p>
        <p><strong>Dezavantajlar:</strong> Düşünme süreci nedeniyle yanıtların klasik modellere göre biraz daha geç başlaması, tam modeli yerel çalıştırmak için devasa sunucu donanımlarına ihtiyaç duyulması.</p>
      `
    },
    {
      slug: "ollama-nedir",
      metaTitle: "Ollama Nedir, Nasıl Kurulur? | Yerel Yapay Zeka LLM Rehberi",
      metaDescription: "Ollama yerel yapay zeka çalıştırma aracı. Mac, Windows, Linux kurulumu, Llama, Mistral ve DeepSeek modellerini local çalıştırma terminal komutları.",
      useCases: [
        "Veri gizliliği hassas projelerde internetsiz yapay zeka kullanımı",
        "Yerel API sunucusu kurarak IDE'lere (Cursor, VS Code) yapay zeka bağlama",
        "Llama 3, Mistral ve DeepSeek modellerini tek komutla indirme",
        "Vektör veritabanları (RAG) için yerel embedding oluşturma",
        "Kendi donanımınızda yapay zeka testi yapma"
      ],
      descriptionTr: `
        <h2>Ollama: Bilgisayarınızdaki Yapay Zeka Sunucusu</h2>
        <p><strong>Ollama</strong>, büyük dil modellerini (LLM) yerel bilgisayarınızda (local) son derece hızlı ve optimize bir şekilde çalıştırmanızı sağlayan açık kaynaklı bir CLI aracıdır. Geliştiriciler, veri gizliliğine önem veren kurumlar ve internetsiz ortamlarda yapay zekaya ihtiyaç duyanlar için endüstri standardı haline gelmiştir.</p>

        <h2>Donanım Optimizasyonu ve GPU Kullanımı</h2>
        <p>Ollama, kurulduğu anda bilgisayarınızın donanım mimarisini (Nvidia CUDA, Apple Silicon M1/M2/M3 Metal API veya Intel/AMD CPU) otomatik olarak tarar. Modeli çalıştırırken mümkün olan en fazla katmanı ekran kartı belleğinize (VRAM) yükler. Eğer VRAM yetersiz kalırsa, modelin kalan kısmını sistem RAM'ine kaydırarak çalışmayı sürdürür.</p>

        <h2>Adım Adım Kurulum ve Temel Terminal Komutları</h2>
        <p>Ollama'yı terminal üzerinden yönetmek son derece basittir:</p>
        <ul>
          <li><strong>Kurulum:</strong> ollama.com adresinden işletim sisteminize uygun sürümü indirin.</li>
          <li><strong>Model Çalıştırma:</strong> <code>ollama run llama3</code> komutunu yazın. Model yoksa otomatik indirilir ve sohbet başlar.</li>
          <li><strong>DeepSeek Çalıştırma:</strong> <code>ollama run deepseek-r1:8b</code> yazarak akıl yürütme modelini saniyeler içinde kurun.</li>
          <li><strong>Liste Görüntüleme:</strong> İndirilen modelleri görmek için <code>ollama list</code> komutunu kullanın.</li>
        </ul>

        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Tamamen ücretsiz ve internetsiz çalışır, harika donanım optimizasyonu, OpenAI uyumlu yerel API sunar (port 11434).</p>
        <p><strong>Dezavantajlar:</strong> Grafiksel bir arayüzü (UI) yoktur (LM Studio veya WebUI gibi harici arayüzlerle bağlanması gerekir).</p>
      `
    }
  ];

  for (const update of updates) {
    const exists = await prisma.aiTool.findUnique({ where: { slug: update.slug } });
    if (exists) {
      await prisma.aiTool.update({
        where: { slug: update.slug },
        data: {
          metaTitle: update.metaTitle,
          metaDescription: update.metaDescription,
          useCases: update.useCases,
          descriptionTr: update.descriptionTr.trim(),
        },
      });
      console.log(`  ✓ Updated: ${update.slug}`);
    } else {
      console.log(`  ✗ Not found: ${update.slug}`);
    }
  }

  console.log("Tool details enrichment completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
