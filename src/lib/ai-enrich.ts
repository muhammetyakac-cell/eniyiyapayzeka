import type { EnrichedData, RawToolData } from "@/types/tools";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";

const SYSTEM_PROMPT = `Sen kıdemli bir Türk SEO içerik editörü, Veri Bilimcisi ve EEAT (Uzmanlık, Otorite, Güven) kurallarına bağlı bir yapay zeka uzmanısın.
Aşağıdaki yapay zeka aracı verisini incele.
Tamamen Türkçe olarak, SEO uyumlu, otoriter ve bilgilendirici bir dil ile şu JSON formatını üret:

{
  "descriptionTr": "En az 800 kelimelik, HTML formatında (<h2>, <p>, <ul>, <strong>) yazılmış detaylı rehber. Şunları içermesi ZORUNLUDUR: <h2>Nedir?</h2>, <h2>Verimlilik Analizi (ROI)</h2>, <h2>Uzman İncelemesi ve EEAT Puanı</h2> (Güvenilirlik ve gizlilik), <h2>Gelişmiş Kullanım İş Akışları</h2>.",
  "metaTitle": "60-70 karakter arası otoriter SEO başlığı.",
  "metaDescription": "150-160 karakter arası meta açıklaması. Anahtar kelimeler içermeli.",
  "useCases": ["3-5 adet spesifik ve profesyonel kullanım alanı"],
  "pricingModel": "Fiyatlandırma modeli (Ücretsiz/Freemium/Ücretli)",
  "hardwareReq": "Donanım gereksinimi (Bulut tabanlı vb.)",
  "bestFor": "Hangi profesyoneller için ideal olduğu"
}

ÖNEMLİ KURALLAR:
- Çıktı sadece saf JSON olmalıdır. Markdown \`\`\`json blokları içinde olmasın.
- Tüm alanlar Türkçe olmalıdır.
- descriptionTr içindeki tüm HTML etiketleri düzgün kapatılmalı ve geçerli bir HTML yapısı sunmalıdır.
- Eğer veri yetersizse, internetteki genel güncel bilgilere dayanarak zenginleştirilmiş içerik üret.`;

function buildUserPrompt(data: RawToolData): string {
  let prompt = `Araç Adı: ${data.name}\n`;
  if (data.description) prompt += `Açıklama: ${data.description}\n`;
  if (data.websiteUrl) prompt += `Web Sitesi: ${data.websiteUrl}\n`;
  if (data.githubUrl) prompt += `GitHub: ${data.githubUrl}\n`;
  if (data.starsCount) prompt += `GitHub Yıldız: ${data.starsCount}\n`;
  prompt += `Kaynak: ${data.source}\n`;
  return prompt;
}

async function callGemini(prompt: string, retries = 3): Promise<string> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\n" + prompt }] },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 429) {
          const delay = Math.min(1000 * Math.pow(4, attempt), 16000);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        throw new Error(`Gemini API error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (err) {
      if (attempt === retries - 1) throw err;
      const delay = Math.min(1000 * Math.pow(4, attempt), 16000);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("All retries exhausted");
}

function parseEnrichedData(raw: string): EnrichedData {
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```/g, "")
    .trim();
  const parsed = JSON.parse(cleaned);

  return {
    descriptionTr: parsed.descriptionTr || "",
    metaTitle: parsed.metaTitle || "",
    metaDescription: parsed.metaDescription || "",
    useCases: Array.isArray(parsed.useCases) ? parsed.useCases : [],
    pricingModel: parsed.pricingModel || "Bilgi mevcut değil",
    hardwareReq: parsed.hardwareReq || "Bilgi mevcut değil",
    bestFor: parsed.bestFor || "Bilgi mevcut değil",
  };
}

export async function enrichTool(data: RawToolData): Promise<EnrichedData> {
  const userPrompt = buildUserPrompt(data);
  const raw = await callGemini(userPrompt);
  return parseEnrichedData(raw);
}
