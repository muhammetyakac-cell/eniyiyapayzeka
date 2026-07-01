import { PrismaClient } from "@prisma/client";
import { runGroqQwenAgent } from "../src/lib/groq-qwen-agent";
import * as dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const CONCURRENT_QWEN_BOTS = 3; 
const DELAY_BETWEEN_RUNS_MS = 1.5 * 60 * 1000; 

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runGroqQwenBotInstance(botId: number) {
  let loopCount = 1;
  while (true) {
    console.log(`\n💡 [GROQ QWEN Bot #${botId} - Tur #${loopCount}] Uyanıyor ve Prompt Üretmek için Qwen 32B API'ye bağlanıyor...`);
    try {
      const existingPrompts = await prisma.prompt.findMany({ select: { title: true } });
      const promptTitles = existingPrompts.map(p => p.title);

      const result = await runGroqQwenAgent(promptTitles);

      if (!result || !result.title || !result.promptText) {
        throw new Error("Geçersiz format");
      }

      // Kategori Bul veya Oluştur
      let category = await prisma.category.findUnique({ where: { slug: result.categorySlug } });
      if (!category) {
        category = await prisma.category.create({
          data: {
            nameTr: result.categorySlug.replace(/-/g, " ").toUpperCase(),
            slug: result.categorySlug,
          }
        });
      }

      // Varsa İlgili Aracı (AiTool) Bul
      let aiTool = await prisma.aiTool.findUnique({ where: { slug: result.toolSlug } });
      
      // Prompt Kaydet
      const createdPrompt = await prisma.prompt.create({
        data: {
          title: result.title,
          promptText: result.promptText,
          useCase: result.useCase,
          categoryId: category.id,
          toolId: aiTool ? aiTool.id : null,
        }
      });
      
      console.log(`✅ [GROQ QWEN Bot #${botId}] YENİ PROMPT EKLENDİ: ${createdPrompt.title}`);

    } catch (error: any) {
      console.log(`❌ [GROQ QWEN Bot #${botId}] Hata: ${error.message} (Sonraki turda denenecek)`);
    }

    loopCount++;
    await sleep(DELAY_BETWEEN_RUNS_MS);
  }
}

async function startGroqQwenSwarm() {
  console.log("==========================================================");
  console.log(`💡 ${CONCURRENT_QWEN_BOTS} ADET PARALEL GROQ QWEN 32B (PROMPT MÜHENDİSİ) BOTU BAŞLATILIYOR 💡`);
  console.log("==========================================================");
  
  for (let i = 1; i <= CONCURRENT_QWEN_BOTS; i++) {
    const startDelay = (i - 1) * 15000;
    setTimeout(() => {
      runGroqQwenBotInstance(i);
    }, startDelay);
  }
}

startGroqQwenSwarm();
