const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";

export interface AutonomousResult {
  tool: {
    name: string;
    slug: string;
    websiteUrl: string;
    categorySlug: string;
    pricingModel: string;
    bestFor: string;
    useCases: string[];
    metaTitle: string;
    metaDescription: string;
    descriptionTr: string;
  };
  blogPost: {
    slug: string;
    title: string;
    excerpt: string;
    metaTitle: string;
    metaDescription: string;
    contentTr: string;
  };
}

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
    "bestFor": "Kimin için uygun (örn: Profesyonel Tasarımcılar ve Stüdyolar)",
    "useCases": ["Alan 1", "Alan 2", "Alan 3"],
    "metaTitle": "SEO Başlığı (Maks 70 kar.)",
    "metaDescription": "SEO Açıklaması (Maks 160 kar.)",
    "descriptionTr": "HTML formatında en az 800 kelime. Şunları içermelidir: <h2>Nedir?</h2>, <h2>Verimlilik Analizi (ROI)</h2> (Zaman ve para tasarrufu analizi), <h2>Uzman İncelemesi ve EEAT Puanı</h2> (Aracın sektördeki güvenilirliği, veri gizliliği politikası ve gerçek hayat performansı), <h2>Gelişmiş İş Akışı Entegrasyonu</h2>."
  },
  "blogPost": {
    "slug": "blog-yazisi-baslik-seo-url",
    "title": "Blog Yazısı Başlığı (Örn: X Aracı ile Verimliliği %300 Artırmanın Yolları: Kapsamlı Rehber)",
    "excerpt": "Blogun otoriter ve tıklamaya teşvik eden kısa özeti",
    "metaTitle": "SEO Meta Title",
    "metaDescription": "SEO Meta Description",
    "contentTr": "HTML formatında 1500+ kelimelik, yukarıdaki araçla bağlantılı, sektör analizleri, vaka çalışmaları (case studies), ROI hesaplamaları ve EEAT standartlarına uygun uzman yorumları barındıran profesyonel Türkçe SEO blog yazısı. (h2, h3, ul, strong formatlarını cömertçe kullan)."
  }
}

ÖNEMLİ:
- Uydurma araç YAZMA.
- KESİNLİKLE DÜZ METİN (PLAIN TEXT) veya MARKDOWN YAZMA!
- Tüm paragraflarını ZORUNLU OLARAK <p> etiketi içine al. Başlıklar için ZORUNLU OLARAK <h2> ve <h3> etiketlerini kullan. Listeler için <ul> ve <li> kullan. HTML etiketlerini kapatmayı unutma.
- İçerikler "Çöp (Spammy)" olmamalıdır; derinlikli, doyurucu ve uzman ağzından yazılmış olmalıdır.
- Çıktı Markdown \`\`\`json blokları olmadan SAF JSON olmalıdır.
- Kullanıcının sisteminde ZATEN BULUNAN araçları KESİNLİKLE tekrar ETMEMELİSİN.
`;

export async function runAutonomousAgent(existingToolNames: string[]): Promise<AutonomousResult> {
  const userPrompt = `Lütfen yepyeni bir araç ve otoriter blog üret.
ŞU ARAÇLAR SİSTEMDE ZATEN VAR, BUNLARI KULLANMA:
${existingToolNames.join(", ")}
`;

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\n" + userPrompt }] }],
      generationConfig: {
        temperature: 0.8, // Farklı niş araçlar bulması için yüksek yaratıcılık
        maxOutputTokens: 8000,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  
  const cleaned = rawText.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned) as AutonomousResult;
}
