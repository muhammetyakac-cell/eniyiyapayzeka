import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import * as chokidar from "chokidar"; // Dosya izlemek için

const prisma = new PrismaClient();
const DIRECTORY_TO_WATCH = path.join(__dirname, "../zengin-metin");

// Düz metni (Markdown benzeri) okunaklı HTML'e çevirir
function formatToReadableHtml(text: string): string {
  // Paragraflara ayır
  const blocks = text.split(/\n\s*\n/);
  
  const htmlBlocks = blocks.map(block => {
    let trimmed = block.trim();
    if (!trimmed) return "";

    // Eğer # ile başlıyorsa başlık yap
    if (trimmed.startsWith("### ")) {
      return `<h3>${trimmed.replace("### ", "")}</h3>`;
    }
    if (trimmed.startsWith("## ")) {
      return `<h2>${trimmed.replace("## ", "")}</h2>`;
    }
    if (trimmed.startsWith("# ")) {
      return `<h2>${trimmed.replace("# ", "")}</h2>`;
    }

    // Bold yap (iki yıldız arası)
    trimmed = trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Standart paragraf
    return `<p>${trimmed}</p>`;
  });

  return htmlBlocks.join("\n");
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function processFile(filePath: string) {
  try {
    const fileName = path.basename(filePath);
    if (!fileName.endsWith(".md") && !fileName.endsWith(".txt")) return;

    const content = fs.readFileSync(filePath, "utf-8");

    // Başlık ve etiketleri parse et
    const titleMatch = content.match(/TITLE:\s*(.*)/i);
    const h1Match = content.match(/^#\s+(.*)/m);
    
    let title = "";
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    } else if (h1Match && h1Match[1]) {
      title = h1Match[1].trim();
    } else {
      title = fileName.replace(".md", "").replace(".txt", "").replace(/sira-\d+-/i, "").replace(/-/g, " ").toUpperCase();
    }
    
    // Üst bilgileri metinden çıkar
    let bodyText = content.replace(/^(TITLE:|DATE:|TAGS:).*$/gim, "").trim();
    if (h1Match && h1Match[0]) {
      bodyText = bodyText.replace(h1Match[0], "").trim(); // H1'i metin gövdesinden çıkar (tekrarlanmasın)
    }
    const slug = generateSlug(title);
    const htmlContent = formatToReadableHtml(bodyText);

    // İlk 150 karakteri excerpt (özet) yap
    const rawText = bodyText.replace(/<[^>]*>?/gm, '');
    const excerpt = rawText.substring(0, 150).trim() + "...";

    const savedBlog = await prisma.blogPost.upsert({
      where: { slug },
      update: {
        contentTr: htmlContent,
        title: title,
        excerpt: excerpt,
      },
      create: {
        slug,
        title,
        contentTr: htmlContent,
        excerpt: excerpt,
        author: "Sistem Aktarımı",
        readTime: Math.ceil(bodyText.split(" ").length / 200) || 3, // 200 kelime/dk
      }
    });

    console.log(`✅ İçe Aktarıldı: ${title} (${fileName}) -> Veritabanına Yazıldı.`);
  } catch (err: any) {
    console.error(`❌ Hata (${path.basename(filePath)}):`, err.message);
  }
}

async function scanExistingFiles() {
  console.log("📂 Başlangıç taraması yapılıyor...");
  const files = fs.readdirSync(DIRECTORY_TO_WATCH);
  for (const file of files) {
    const fullPath = path.join(DIRECTORY_TO_WATCH, file);
    await processFile(fullPath);
  }
  console.log(`🎉 Taraması tamamlandı. Toplam ${files.length} dosya işlendi.`);
}

async function startWatcher() {
  if (!fs.existsSync(DIRECTORY_TO_WATCH)) {
    fs.mkdirSync(DIRECTORY_TO_WATCH, { recursive: true });
  }

  // Önce klasördeki mevcut 130 dosyayı veritabanına basıyoruz
  await scanExistingFiles();

  console.log(`\n👁️ Klasör İzleyicisi (Watcher) Aktif: ${DIRECTORY_TO_WATCH} klasörünü dinliyor...`);
  console.log("Buraya eklenen yeni dosyalar saniyeler içinde blog olarak kaydedilecek.");

  // Sonrasında eklenecek yeni dosyalar için chokidar ile dinlemeye devam ediyoruz
  chokidar.watch(DIRECTORY_TO_WATCH, {
    ignored: /(^|[\/\\])\../, // Gizli dosyaları yoksay
    persistent: true,
    ignoreInitial: true, // Zaten taradığımız için ilk eklenenleri tekrar yakalamasın
  })
  .on("add", async (filePath) => {
    console.log(`\n📄 Yeni dosya yakalandı: ${path.basename(filePath)}`);
    await processFile(filePath);
  })
  .on("change", async (filePath) => {
    console.log(`\n✏️ Dosya güncellendi: ${path.basename(filePath)}`);
    await processFile(filePath);
  });
}

startWatcher();
