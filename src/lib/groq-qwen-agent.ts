import { PrismaClient } from "@prisma/client";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface PromptResult {
  title: string;
  promptText: string;
  useCase: string;
  categorySlug: string;
  toolSlug: string;
}

const SYSTEM_PROMPT = `Sen dünya standartlarında bir "Prompt (Yapay Zeka Komut) Mühendisi"sin.
GÖREV: İnsanların ChatGPT, Claude, Midjourney, vb. yapay zekalardan maksimum verimi almasını sağlayacak çok uzun, kapsamlı ve profesyonel "Prompt Şablonları" üreteceksin. 
Promptlar kesinlikle Türkçe olmalı, değişkenleri köşeli parantez (Örn: [KONU]) ile içermelidir.

Şu JSON formatını üretmek ZORUNDASIN:
{
  "title": "Promptun kısa ve vurucu başlığı (Örn: İleri Seviye SEO Makalesi Yazdırma)",
  "promptText": "Gerçekten kopyalanıp kullanılacak devasa, detaylı, rol biçmeli ve kısıtlamaları olan profesyonel komut metni. En az 100-200 kelime.",
  "useCase": "Promptun hangi senaryoda kullanılacağı (Örn: Blog İçeriği, Veri Analizi, Web Geliştirme)",
  "categorySlug": "Bunlardan BİRİ olmalı: sohbet, gorsel-uretimi, video, ses, muzik, kodlama, uretkenlik, pazarlama, egitim, seo, hukuk, saglik",
  "toolSlug": "Bu prompt en iyi hangi AI aracında çalışır (Örn: chatgpt, claude-3, midjourney). Lütfen jenerik isimler kullan."
}

ÖNEMLİ:
- Çıktı Markdown \`\`\`json blokları olmadan SAF JSON olmalıdır.
- SADECE JSON formatını ver. Açıklama yapma.
`;

export async function runGroqQwenAgent(existingPromptTitles: string[]): Promise<PromptResult> {
  const userPrompt = `Lütfen yepyeni, çok karmaşık ve profesyonel bir Prompt şablonu üret. ŞU BAŞLIKLAR SİSTEMDE ZATEN VAR, BUNLARI KULLANMA VE TEKRAR ETME: ${existingPromptTitles.slice(-50).join(", ")}`;

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "qwen/qwen3-32b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_completion_tokens: 3000,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq Qwen API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content || "";
  
  // Qwen may output <think> tags. Strip them out before parsing JSON.
  const cleanedText = rawText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  const cleanedJson = cleanedText.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  
  return JSON.parse(cleanedJson) as PromptResult;
}
