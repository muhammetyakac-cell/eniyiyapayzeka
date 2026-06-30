import type { EnrichedData, RawToolData } from "@/types/tools";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";

const SYSTEM_PROMPT = `Sen bir Türk SEO içerik editörüsün.
Aşağıdaki yapay zeka aracı verisini incele.
Tamamen Türkçe olarak, SEO uyumlu ve doğal bir dil ile şu JSON'ı üret:

{
  "descriptionTr": "3 paragraflık, hedef kitleyi yakalayan, fayda odaklı Türkçe açıklama (300-400 kelime). Başlıklar **H2** formatında olsun.",
  "metaTitle": "60-70 karakter arası SEO başlık. Format: '{Araç Adı} Nedir, Ne İşe Yarar? | En İyi Yapay Zeka Araçları'",
  "metaDescription": "150-160 karakter arası meta açıklaması. Anahtar kelime içermeli.",
  "useCases": ["3-5 adet gerçek kullanım alanı, her biri 5-10 kelime"],
  "pricingModel": "Detaylı fiyatlandırma bilgisi (ücretsiz/freemium/ücretli/açık kaynak), varsa spesifik plan fiyatları",
  "hardwareReq": "Donanım gereksinimi. Yerel çalıştırılabiliyorsa GPU/RAM ihtiyacı, cloud-only ise belirt",
  "bestFor": "Hangi kullanıcı tipi için ideal (örn: Yazılımcılar, İçerik üreticileri, Tasarımcılar)"
}

ÖNEMLİ KURALLAR:
- JSON dışında hiçbir metin üretme.
- Tüm çıktı Türkçe olmalı.
- descriptionTr HTML etiketleri içerebilir (<h2>, <p>, <ul>, <li>).
- useCases her biri spesifik ve gerçekçi olmalı.
- Eğer veri eksikse tahmin yürütme, "Bilgi mevcut değil" yaz.`;

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
