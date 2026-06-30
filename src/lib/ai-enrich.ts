import type { EnrichedData, RawToolData } from "@/types/tools";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";

const SYSTEM_PROMPT = `Sen kıdemli bir Türk SEO içerik editörü ve yapay zeka uzmanısın.
Aşağıdaki yapay zeka aracı verisini incele.
Tamamen Türkçe olarak, SEO uyumlu, profesyonel, akıcı ve bilgilendirici bir dil ile şu JSON formatını üret:

{
  "descriptionTr": "En az 400-500 kelimelik, HTML formatında (<h2>, <p>, <ul>, <ol>, <li>, <strong>) yazılmış, son derece detaylı Türkçe rehber metni. Şu başlıkları içermesi zorunludur: <h2>{Araç Adı} Nedir ve Nasıl Çalışır?</h2> (detaylı tanım), <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2> (aracı profesyonel süreçlere entegre eden karmaşık iş akışları ve kullanım modelleri, bullet list formatında), <h2>Adım Adım Başlangıç Kılavuzu</h2> (aracı kullanmaya başlamak için sıralı adımlar, numaralandırılmış liste formatında), <h2>Avantajlar ve Sınırlar</h2> (aracın artı ve eksi yanları).",
  "metaTitle": "60-70 karakter arası SEO başlığı. Format: '{Araç Adı} Nedir, Nasıl Kullanılır? | eniyiyapayzeka'",
  "metaDescription": "150-160 karakter arası meta açıklaması. Anahtar kelimeler içermeli ve tıklamaya teşvik etmeli.",
  "useCases": ["3-5 adet spesifik ve gerçekçi kullanım alanı, her biri 5-10 kelime"],
  "pricingModel": "Detaylı fiyatlandırma modeli bilgisi (Ücretsiz/Freemium/Ücretli/Açık Kaynak) ve varsa spesifik plan detayları",
  "hardwareReq": "Donanım gereksinimi. Yerel (local) çalıştırılabiliyorsa GPU/RAM ihtiyacı, sadece bulut tabanlıysa 'Bulut tabanlı (Cloud-only)' belirtin",
  "bestFor": "Hangi kullanıcı tipi için ideal olduğu (örn: Yazılımcılar, Pazarlamacılar, Dijital İçerik Üreticileri)"
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
