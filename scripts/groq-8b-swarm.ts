import { PrismaClient } from "@prisma/client";
import { runGroq8BAgent } from "../src/lib/groq-8b-agent";
import * as dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const CONCURRENT_GROQ_BOTS = 3; 
const DELAY_BETWEEN_RUNS_MS = 2 * 60 * 1000; 

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runGroq8BBotInstance(botId: number) {
  let loopCount = 1;
  while (true) {
    console.log(`\n⚡ [GROQ 8B Bot #${botId} - Tur #${loopCount}] Uyanıyor ve Llama 3.1 (8B) API'ye bağlanıyor...`);
    try {
      const existingTools = await prisma.aiTool.findMany({ select: { name: true } });
      const toolNames = existingTools.map(t => t.name);

      const result = await runGroq8BAgent(toolNames);

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
      console.log(`✅ [GROQ 8B Bot #${botId}] YENİ ARAÇ: ${createdTool.name}`);

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
          author: `Otonom AI (Groq 8B Bot ${botId})`,
          metaTitle: result.blogPost.metaTitle,
          metaDescription: result.blogPost.metaDescription,
        }
      });

      await prisma.blogPostTool.upsert({
        where: { blogPostId_toolId: { blogPostId: createdBlog.id, toolId: createdTool.id } },
        update: {},
        create: { blogPostId: createdBlog.id, toolId: createdTool.id }
      }).catch(() => {});

      console.log(`✅ [GROQ 8B Bot #${botId}] YENİ BLOG: ${createdBlog.title}`);

    } catch (error: any) {
      console.log(`❌ [GROQ 8B Bot #${botId}] Hata: ${error.message} (Sonraki turda denenecek)`);
    }

    loopCount++;
    await sleep(DELAY_BETWEEN_RUNS_MS);
  }
}

async function startGroq8BSwarm() {
  console.log("==========================================================");
  console.log(`⚡ ${CONCURRENT_GROQ_BOTS} ADET PARALEL GROQ (LLAMA-3.1-8B) BOTU BAŞLATILIYOR ⚡`);
  console.log("==========================================================");
  
  for (let i = 1; i <= CONCURRENT_GROQ_BOTS; i++) {
    const startDelay = (i - 1) * 15000;
    setTimeout(() => {
      runGroq8BBotInstance(i);
    }, startDelay);
  }
}

startGroq8BSwarm();
