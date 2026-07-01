import { runNvidiaAgent } from "../src/lib/nvidia-agent";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

async function testNvidiaAgent() {
  console.log("🛠️ NVIDIA MİNİMAX-M3 TESTİ BAŞLIYOR...");
  
  try {
    const existingTools = await prisma.aiTool.findMany({ select: { name: true } });
    const toolNames = existingTools.map(t => t.name);

    console.log("Veritabanı okundu. Nvidia API'sine İstek Atılıyor (Lütfen bekleyin, 1500 kelime üretmek biraz sürebilir)...");
    
    const result = await runNvidiaAgent(toolNames);
    
    console.log("\n==============================================");
    console.log("✅ NVIDIA BAŞARIYLA ÜRETTİ (ARAÇ):");
    console.log("==============================================");
    console.log(`İsim: ${result.tool.name}`);
    console.log(`Kategori: ${result.tool.categorySlug}`);
    console.log(`Fiyatlandırma: ${result.tool.pricingModel}`);
    console.log(`Kimler İçin: ${result.tool.bestFor}`);
    console.log(`Kullanım Alanları: ${result.tool.useCases.join(", ")}`);
    console.log("\n--- ARAÇ AÇIKLAMASI (HTML) ÖZETİ ---");
    console.log(result.tool.descriptionTr.substring(0, 500) + "... [DEVAMI VAR]");

    console.log("\n==============================================");
    console.log("✅ NVIDIA BAŞARIYLA ÜRETTİ (BLOG):");
    console.log("==============================================");
    console.log(`Başlık: ${result.blogPost.title}`);
    console.log(`Özet: ${result.blogPost.excerpt}`);
    console.log(`SEO Meta Title: ${result.blogPost.metaTitle}`);
    console.log("\n--- BLOG İÇERİĞİ (HTML) ÖZETİ ---");
    console.log(result.blogPost.contentTr.substring(0, 800) + "... [DEVAMI VAR]");
    
    console.log("\nNOT: Test başarılı. Veritabanına YAZILMADI.");
  } catch (error) {
    console.error("Nvidia Testi Başarısız Oldu:", error);
  }
}

testNvidiaAgent();
