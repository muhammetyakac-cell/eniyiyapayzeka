import { AutonomousResult } from "./autonomous-agent";

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

const SYSTEM_PROMPT = `Sen dünya standartlarında bir SEO uzmanı, Veri Bilimcisi ve EEAT (Deneyim, Uzmanlık, Otorite, Güvenilirlik) kurallarına sıkı sıkıya bağlı bir içerik mühendisisin.
GÖREV: Web sitemize tamamen otonom olarak yeni, gerçek hayatta var olan ve çok aranan bir Yapay Zeka Aracı (AI Tool) ekleyecek, ardından bu araçla bağlantılı 1500+ kelimelik devasa, otoriter ve kusursuz bir SEO Blog Yazısı üreteceksin.

Şu JSON formatını üretmek ZORUNDASIN:
{
  "tool": {
    "name": "Aracın gerçek adı",
    "slug": "arac-adi-nedir",
    "websiteUrl": "https://...",
    "categorySlug": "Bunlardan BİRİ olmalı: sohbet, gorsel-uretimi, video, ses, muzik, kodlama, uretkenlik, pazarlama, egitim, seo, hukuk, saglik",
    "pricingModel": "FREE, FREEMIUM veya PAID",
    "bestFor": "Kimin için uygun",
    "useCases": ["Alan 1", "Alan 2", "Alan 3"],
    "metaTitle": "SEO Başlığı (Maks 70 kar.)",
    "metaDescription": "SEO Açıklaması (Maks 160 kar.)",
    "descriptionTr": "HTML formatında en az 800 kelime. Şunları içermelidir: <h2>Nedir?</h2>, <h2>Verimlilik Analizi (ROI)</h2>, <h2>Uzman İncelemesi ve EEAT Puanı</h2>, <h2>Gelişmiş İş Akışı Entegrasyonu</h2>."
  },
  "blogPost": {
    "slug": "blog-yazisi-baslik-seo-url",
    "title": "Blog Yazısı Başlığı (Örn: X Aracı ile Verimliliği Artırma)",
    "excerpt": "Blogun otoriter kısa özeti",
    "metaTitle": "SEO Meta Title",
    "metaDescription": "SEO Meta Description",
    "contentTr": "HTML formatında 1500+ kelimelik, yukarıdaki araçla bağlantılı profesyonel Türkçe SEO blog yazısı. (h2, h3, ul, p, strong formatlarını ZORUNLU olarak kullan)."
  }
}

ÖNEMLİ:
- Uydurma araç YAZMA.
- KESİNLİKLE DÜZ METİN (PLAIN TEXT) veya MARKDOWN YAZMA!
- Tüm paragraflarını ZORUNLU OLARAK <p> etiketi içine al. Başlıklar için ZORUNLU OLARAK <h2> ve <h3> etiketlerini kullan.
- Çıktı Markdown \`\`\`json blokları olmadan SAF JSON olmalıdır.
- Kullanıcının sisteminde ZATEN BULUNAN araçları KESİNLİKLE tekrar ETMEMELİSİN.
`;

export async function runMoonshotAgent(existingToolNames: string[]): Promise<AutonomousResult> {
  const userPrompt = `Lütfen yepyeni bir araç ve otoriter blog üret. ŞU ARAÇLAR SİSTEMDE ZATEN VAR, BUNLARI KULLANMA: ${existingToolNames.join(", ")}`;

  const response = await fetch(MOONSHOT_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${MOONSHOT_API_KEY}`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "moonshotai/kimi-k2.6",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 16384,
      temperature: 1.00,
      top_p: 1.00,
      stream: false
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Moonshot API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content || "";
  
  const cleaned = rawText.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned) as AutonomousResult;
}
