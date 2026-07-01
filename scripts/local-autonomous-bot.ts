import { PrismaClient } from "@prisma/client";
import { runAutonomousAgent } from "../src/lib/autonomous-agent";
import * as dotenv from "dotenv";

// Load environment variables locally
dotenv.config();

const prisma = new PrismaClient();

// Her döngü arasında ne kadar bekleneceği (Gemini API limitlerine takılmamak için)
// 2 dakika = 120.000 milisaniye.
const DELAY_BETWEEN_RUNS_MS = 2 * 60 * 1000; 

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startInfiniteBot() {
  console.log("=================================================");
  console.log("🤖 ENİYİYAPAYZEKA OTONOM BÜYÜME BOTU BAŞLATILDI 🤖");
  console.log("=================================================");
  console.log("Bu pencere açık kaldığı sürece siteniz kendi kendine büyüyecek.");
  console.log(`Döngü aralığı: ${DELAY_BETWEEN_RUNS_MS / 1000 / 60} Dakika`);
  
  let loopCount = 1;

  while (true) {
    console.log(`\n--- [Döngü #${loopCount}] Yeni Tur Başlıyor: ${new Date().toLocaleTimeString()} ---`);

    try {
      // 1. Veritabanındaki mevcut araçları al
      const existingTools = await prisma.aiTool.findMany({ select: { name: true } });
      const toolNames = existingTools.map(t => t.name);

      console.log(`Veritabanında ${toolNames.length} araç var. Gemini API çağrılıyor...`);

      // 2. Gemini Ajanını Çalıştır
      const result = await runAutonomousAgent(toolNames);

      if (!result || !result.tool || !result.blogPost) {
        throw new Error("Gemini'dan geçersiz format döndü.");
      }

      // 3. Kategori kontrolü
      let category = await prisma.category.findUnique({
        where: { slug: result.tool.categorySlug }
      });
      if (!category) {
        category = await prisma.category.create({
          data: {
            nameTr: result.tool.categorySlug.replace(/-/g, " ").toUpperCase(),
            slug: result.tool.categorySlug,
          }
        });
      }

      // 4. Aracı Veritabanına Yaz
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
          categories: {
            create: [{ category: { connect: { id: category.id } } }]
          }
        }
      });
      console.log(`✅ YENİ ARAÇ EKLENDİ: ${createdTool.name}`);

      // 5. Blog Yazısını Veritabanına Yaz
      const createdBlog = await prisma.blogPost.upsert({
        where: { slug: result.blogPost.slug },
        update: {},
        create: {
          slug: result.blogPost.slug,
          title: result.blogPost.title,
          excerpt: result.blogPost.excerpt,
          contentTr: result.blogPost.contentTr,
          readTime: 6,
          author: "Otonom AI",
          metaTitle: result.blogPost.metaTitle,
          metaDescription: result.blogPost.metaDescription,
        }
      });

      // Blog ve Aracı bağla
      await prisma.blogPostTool.upsert({
        where: { blogPostId_toolId: { blogPostId: createdBlog.id, toolId: createdTool.id } },
        update: {},
        create: { blogPostId: createdBlog.id, toolId: createdTool.id }
      }).catch(() => {});

      console.log(`✅ YENİ BLOG EKLENDİ: ${createdBlog.title}`);
      console.log("Canlı site otomatik olarak güncellendi!");

    } catch (error: any) {
      console.error(`❌ HATA OLUŞTU: ${error.message}`);
      console.log("Bir sonraki turda tekrar denenecek...");
    }

    loopCount++;
    console.log(`⏳ ${DELAY_BETWEEN_RUNS_MS / 1000 / 60} dakika bekleniyor (Gemini limit koruması)...`);
    await sleep(DELAY_BETWEEN_RUNS_MS);
  }
}

startInfiniteBot()
  .catch(e => {
    console.error("Kritik Hata:", e);
    process.exit(1);
  });
