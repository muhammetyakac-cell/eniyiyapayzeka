import { PrismaClient } from "@prisma/client";
import { runAutonomousAgent } from "../src/lib/autonomous-agent";
import * as dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const CONCURRENT_BOTS = 3; // Aynı anda çalışacak bot sayısı
const DELAY_BETWEEN_RUNS_MS = 2 * 60 * 1000; // 2 dakika

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runBotInstance(botId: number) {
  let loopCount = 1;
  while (true) {
    console.log(`\n🤖 [Bot #${botId} - Tur #${loopCount}] Uyanıyor ve Gemini API'ye bağlanıyor...`);
    try {
      const existingTools = await prisma.aiTool.findMany({ select: { name: true } });
      const toolNames = existingTools.map(t => t.name);

      const result = await runAutonomousAgent(toolNames);

      if (!result || !result.tool || !result.blogPost) {
        throw new Error("Geçersiz format");
      }

      // Kategori
      let category = await prisma.category.findUnique({ where: { slug: result.tool.categorySlug } });
      if (!category) {
        category = await prisma.category.create({
          data: {
            nameTr: result.tool.categorySlug.replace(/-/g, " ").toUpperCase(),
            slug: result.tool.categorySlug,
          }
        });
      }

      // Araç Kaydet
      const createdTool = await prisma.aiTool.upsert({
        where: { slug: result.tool.slug },
        update: {},
        create: {
          slug: result.tool.slug,
          name: result.tool.name,
          websiteUrl: result.tool.websiteUrl,
          pricingModel: result.tool.pricingModel as any || "FREEMIUM",
          bestFor: result.tool.bestFor,
          useCases: result.tool.useCases,
          metaTitle: result.tool.metaTitle,
          metaDescription: result.tool.metaDescription,
          descriptionTr: result.tool.descriptionTr,
          source: "MANUAL",
          categories: { create: [{ category: { connect: { id: category.id } } }] }
        }
      });
      console.log(`✅ [Bot #${botId}] YENİ ARAÇ: ${createdTool.name}`);

      // Blog Kaydet
      const createdBlog = await prisma.blogPost.upsert({
        where: { slug: result.blogPost.slug },
        update: {},
        create: {
          slug: result.blogPost.slug,
          title: result.blogPost.title,
          excerpt: result.blogPost.excerpt,
          contentTr: result.blogPost.contentTr,
          readTime: 6,
          author: `Otonom AI (Bot ${botId})`,
          metaTitle: result.blogPost.metaTitle,
          metaDescription: result.blogPost.metaDescription,
        }
      });

      await prisma.blogPostTool.upsert({
        where: { blogPostId_toolId: { blogPostId: createdBlog.id, toolId: createdTool.id } },
        update: {},
        create: { blogPostId: createdBlog.id, toolId: createdTool.id }
      }).catch(() => {});

      console.log(`✅ [Bot #${botId}] YENİ BLOG: ${createdBlog.title}`);

    } catch (error: any) {
      console.log(`❌ [Bot #${botId}] Hata: ${error.message} (Sonraki turda denenecek)`);
    }

    loopCount++;
    await sleep(DELAY_BETWEEN_RUNS_MS);
  }
}

async function startSwarm() {
  console.log("==========================================================");
  console.log(`🚀 ${CONCURRENT_BOTS} ADET PARALEL YAPAY ZEKA BOTU BAŞLATILIYOR 🚀`);
  console.log("==========================================================");
  console.log(`Her bot birbirini beklemeksizin kendi döngüsünde (2dk) çalışacak.`);
  
  for (let i = 1; i <= CONCURRENT_BOTS; i++) {
    // API limitlerine aynı anda (DDOS gibi) çarpmamak için her bot arasına 20 saniye gecikme koyuyoruz.
    const startDelay = (i - 1) * 20000;
    setTimeout(() => {
      runBotInstance(i);
    }, startDelay);
  }
}

startSwarm();
