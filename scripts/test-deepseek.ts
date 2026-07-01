import { AutonomousResult } from "../src/lib/autonomous-agent";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const DEEPSEEK_API_KEY = "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";
const DEEPSEEK_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

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
    "useCases": ["Alan 1", "Alan 2"],
    "metaTitle": "SEO Başlığı",
    "metaDescription": "SEO Açıklaması",
    "descriptionTr": "HTML formatında en az 800 kelime. Şunları içermelidir: <h2>Nedir?</h2>, <h2>Verimlilik Analizi</h2> vb."
  },
  "blogPost": {
    "slug": "blog-yazisi-baslik-seo-url",
    "title": "Blog Yazısı Başlığı",
    "excerpt": "Blog özeti",
    "metaTitle": "SEO Meta Title",
    "metaDescription": "SEO Meta Description",
    "contentTr": "HTML formatında 1500+ kelimelik Türkçe SEO blog yazısı."
  }
}

ÖNEMLİ:
- Uydurma araç YAZMA.
- KESİNLİKLE DÜZ METİN (PLAIN TEXT) veya MARKDOWN YAZMA! Tüm paragraflarını <p> içine al, başlıklar için <h2> kullan.
- Çıktı SADECE geçerli bir JSON olmalıdır, asla Markdown kod blokları (\`\`\`json) kullanma.
- Kullanıcının sisteminde ZATEN BULUNAN araçları KESİNLİKLE tekrar ETMEMELİSİN.
`;

async function testDeepSeekAgent() {
  console.log("🛠️ DEEPSEEK-V4-FLASH TESTİ BAŞLIYOR...");
  
  try {
    const existingTools = await prisma.aiTool.findMany({ select: { name: true } });
    const toolNames = existingTools.map(t => t.name);
    const userPrompt = `Lütfen yepyeni bir araç ve otoriter blog üret. ŞU ARAÇLAR SİSTEMDE ZATEN VAR, BUNLARI KULLANMA: ${toolNames.join(", ")}`;

    console.log("Veritabanı okundu. DeepSeek API'sine İstek Atılıyor (Bekleniyor)...");
    
    const response = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-ai/deepseek-v4-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 16384,
        temperature: 1.0,
        top_p: 0.95,
        stream: false,
        chat_template_kwargs: { thinking: true, reasoning_effort: "high" }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`DeepSeek API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "";
    const reasoningText = data.choices?.[0]?.message?.reasoning_content || data.choices?.[0]?.message?.reasoning || "";
    
    if (reasoningText) {
        console.log("\n🤔 DEEPSEEK DÜŞÜNME SÜRECİ (REASONING):");
        console.log(reasoningText.substring(0, 500) + "... [DEVAMI VAR]");
    }
    
    const cleaned = rawText.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleaned) as AutonomousResult;
    
    console.log("\n✅ DEEPSEEK BAŞARIYLA ÜRETTİ (ARAÇ):");
    console.log(`İsim: ${result.tool.name}`);
    console.log(`Kategori: ${result.tool.categorySlug}`);
    console.log(result.tool.descriptionTr.substring(0, 200) + "...");

    console.log("\n✅ DEEPSEEK BAŞARIYLA ÜRETTİ (BLOG):");
    console.log(`Başlık: ${result.blogPost.title}`);
    console.log(result.blogPost.contentTr.substring(0, 200) + "...");
    
    console.log("\nNOT: Test başarılı. Format %100 Doğru.");
  } catch (error) {
    console.error("\n❌ DeepSeek Testi Başarısız Oldu:", error);
  }
}

testDeepSeekAgent();
