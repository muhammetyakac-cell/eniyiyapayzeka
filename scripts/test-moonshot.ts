import { runMoonshotAgent } from "../src/lib/moonshot-agent";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

async function testMoonshotAgent() {
  console.log("🛠️ MOONSHOT KIMI-K2.6 TESTİ BAŞLIYOR...");
  
  try {
    const existingTools = await prisma.aiTool.findMany({ select: { name: true } });
    const toolNames = existingTools.map(t => t.name);

    console.log("Veritabanı okundu. Moonshot API'sine İstek Atılıyor (Bekleniyor)...");
    
    const result = await runMoonshotAgent(toolNames);
    
    console.log("\n✅ MOONSHOT BAŞARIYLA ÜRETTİ (ARAÇ):");
    console.log(`İsim: ${result.tool.name}`);
    console.log(`Kategori: ${result.tool.categorySlug}`);
    console.log(result.tool.descriptionTr.substring(0, 300) + "...");

    console.log("\n✅ MOONSHOT BAŞARIYLA ÜRETTİ (BLOG):");
    console.log(`Başlık: ${result.blogPost.title}`);
    console.log(result.blogPost.contentTr.substring(0, 500) + "...");
    
    console.log("\nNOT: Test başarılı.");
  } catch (error) {
    console.error("Moonshot Testi Başarısız Oldu:", error);
  }
}

testMoonshotAgent();
