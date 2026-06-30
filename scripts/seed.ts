import { PrismaClient } from "@prisma/client";
import { enrichTool } from "../src/lib/ai-enrich";
import { toolSlugify, categorySlugify } from "../src/lib/utils/slugify";
import type { RawToolData } from "../src/types/tools";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  const categories = [
    { name: "Sohbet", slug: categorySlugify("sohbet"), description: "İnsan benzeri sohbet ve metin üretimi yapabilen yapay zeka modelleri." },
    { name: "Görsel Üretimi", slug: categorySlugify("gorsel-uretimi"), description: "Metinden görsel, fotoğraf ve sanat eseri üreten yapay zeka araçları." },
    { name: "Kodlama", slug: categorySlugify("kodlama"), description: "Yazılım geliştirme, kod tamamlama ve hata ayıklama için yapay zeka araçları." },
    { name: "Müzik", slug: categorySlugify("muzik"), description: "Müzik besteleme, ses üretimi ve düzenleme için yapay zeka araçları." },
    { name: "Video", slug: categorySlugify("video"), description: "Video üretimi, düzenleme ve animasyon için yapay zeka araçları." },
    { name: "Metin Yazarlığı", slug: categorySlugify("metin-yazarligi"), description: "İçerik üretimi, blog yazma ve pazarlama metinleri için yapay zeka." },
    { name: "Ses", slug: categorySlugify("ses"), description: "Ses sentezleme, klonlama ve düzenleme için yapay zeka araçları." },
    { name: "Açık Kaynak", slug: categorySlugify("acik-kaynak"), description: "Yerel bilgisayarında çalıştırabileceğin açık kaynak yapay zeka araçları." },
    { name: "Üretkenlik", slug: categorySlugify("uretim"), description: "İş akışı otomasyonu ve üretkenlik artırıcı yapay zeka araçları." },
    { name: "Sunum", slug: categorySlugify("sunum"), description: "Sunum ve görsel içerik hazırlama için yapay zeka araçları." },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { slug: cat.slug, nameTr: cat.name, descriptionTr: cat.description },
    });
    console.log(`  Category: ${cat.name}`);
  }

  const tools: RawToolData[] = [
    { name: "ChatGPT", websiteUrl: "https://chat.openai.com", description: "OpenAI'nin geliştirdiği en popüler sohbet robotu. GPT-4o modeli ile metin, kod ve görsel analizi yapabilir.", starsCount: 0, source: "MANUAL", categorySlugs: ["sohbet", "metin-yazarligi", "kodlama"] },
    { name: "Claude 3.5 Sonnet", websiteUrl: "https://claude.ai", description: "Anthropic'in geliştirdiği güvenli ve güçlü yapay zeka asistanı. Uzun metinler ve kod analizinde başarılı.", starsCount: 0, source: "MANUAL", categorySlugs: ["sohbet", "kodlama"] },
    { name: "Gemini 2.5 Pro", websiteUrl: "https://gemini.google.com", description: "Google DeepMind'in en gelişmiş çok modlu yapay zeka modeli. Metin, görsel, ses ve video işleyebilir.", starsCount: 0, source: "MANUAL", categorySlugs: ["sohbet", "gorsel-uretimi", "kodlama"] },
    { name: "Midjourney", websiteUrl: "https://midjourney.com", description: "Discord tabanlı yapay zeka görsel üretim aracı. Sanatsal ve yaratıcı görseller üretir.", starsCount: 0, source: "MANUAL", categorySlugs: ["gorsel-uretimi"] },
    { name: "DALL-E 3", websiteUrl: "https://openai.com/dall-e-3", description: "OpenAI'nin metinden görsel üreten modeli. ChatGPT Plus aboneleri kullanabilir.", starsCount: 0, source: "MANUAL", categorySlugs: ["gorsel-uretimi"] },
    { name: "Stable Diffusion 3", websiteUrl: "https://stability.ai", description: "Stability AI'nin açık kaynak görsel üretim modeli. Yerel bilgisayarında çalıştırabilirsin.", starsCount: 25000, githubUrl: "https://github.com/Stability-AI/stablediffusion", source: "MANUAL", categorySlugs: ["gorsel-uretimi", "acik-kaynak"] },
    { name: "GitHub Copilot", websiteUrl: "https://github.com/features/copilot", description: "GitHub'ın yapay zeka destekli kod tamamlama aracı. VS Code, JetBrains ve diğer IDE'lerle uyumlu.", starsCount: 0, source: "MANUAL", categorySlugs: ["kodlama"] },
    { name: "Cursor", websiteUrl: "https://cursor.com", description: "Yapay zeka entegre kod editörü. VS Code tabanlı olup Claude ve GPT modelleri ile kod yazmanı sağlar.", starsCount: 30000, githubUrl: "https://github.com/getcursor/cursor", source: "MANUAL", categorySlugs: ["kodlama"] },
    { name: "Windsurf", websiteUrl: "https://windsurf.com", description: "Yapay zeka destekli IDE. Codeium tarafından geliştirilen akıllı kod editörü.", starsCount: 15000, githubUrl: "https://github.com/codeium/windsurf", source: "MANUAL", categorySlugs: ["kodlama"] },
    { name: "Perplexity AI", websiteUrl: "https://perplexity.ai", description: "Yapay zeka destekli arama motoru ve araştırma asistanı. Kaynak göstererek cevap verir.", starsCount: 0, source: "MANUAL", categorySlugs: ["sohbet", "uretim"] },
    { name: "DeepSeek", websiteUrl: "https://deepseek.com", description: "Çin merkezli yapay zeka şirketinin geliştirdiği güçlü dil modeli. R1 modeli ile matematik ve kodlamada başarılı.", starsCount: 50000, githubUrl: "https://github.com/deepseek-ai", source: "MANUAL", categorySlugs: ["sohbet", "kodlama", "acik-kaynak"] },
    { name: "Llama 4", websiteUrl: "https://ai.meta.com/llama", description: "Meta'nın açık kaynak dil modeli. Yerel bilgisayarında çalıştırabilir ve özelleştirebilirsin.", starsCount: 35000, githubUrl: "https://github.com/meta-llama", source: "MANUAL", categorySlugs: ["sohbet", "acik-kaynak"] },
    { name: "Mistral AI", websiteUrl: "https://mistral.ai", description: "Fransız yapay zeka şirketinin geliştirdiği yüksek performanslı dil modelleri. Açık kaynak ve ticari seçenekler sunar.", starsCount: 12000, githubUrl: "https://github.com/mistralai", source: "MANUAL", categorySlugs: ["sohbet", "acik-kaynak"] },
    { name: "Ollama", websiteUrl: "https://ollama.ai", description: "Yerel bilgisayarında büyük dil modellerini çalıştırmanı sağlayan araç. Llama, Mistral, Gemma gibi modelleri tek komutla çalıştır.", starsCount: 75000, githubUrl: "https://github.com/ollama/ollama", source: "MANUAL", categorySlugs: ["acik-kaynak"] },
    { name: "LM Studio", websiteUrl: "https://lmstudio.ai", description: "Görsel arayüzlü yerel yapay zeka model çalıştırma aracı. GGUF modellerini kolayca indirip çalıştırabilirsin.", starsCount: 15000, githubUrl: "https://github.com/lmstudio-ai", source: "MANUAL", categorySlugs: ["acik-kaynak"] },
    { name: "ComfyUI", websiteUrl: "https://comfyanonymous.github.io/ComfyUI", description: "Düğüm tabanlı görsel arayüz ile Stable Diffusion iş akışları oluşturma aracı.", starsCount: 40000, githubUrl: "https://github.com/comfyanonymous/ComfyUI", source: "MANUAL", categorySlugs: ["gorsel-uretimi", "acik-kaynak"] },
    { name: "RunwayML", websiteUrl: "https://runwayml.com", description: "Profesyonel video düzenleme ve üretim için yapay zeka platformu. Gen-3 Alpha ile metinden video üretir.", starsCount: 0, source: "MANUAL", categorySlugs: ["video"] },
    { name: "Sora", websiteUrl: "https://openai.com/sora", description: "OpenAI'nin metinden video üreten yapay zeka modeli. Gerçekçi ve yaratıcı videolar oluşturur.", starsCount: 0, source: "MANUAL", categorySlugs: ["video"] },
    { name: "Suno AI", websiteUrl: "https://suno.ai", description: "Metinden müzik ve şarkı üreten yapay zeka aracı. Farklı türlerde ve dillerde müzik besteler.", starsCount: 0, source: "MANUAL", categorySlugs: ["muzik"] },
    { name: "Udio", websiteUrl: "https://udio.com", description: "Yapay zeka ile müzik üretme platformu. Metin açıklamalarından profesyonel kalitede şarkılar oluşturur.", starsCount: 0, source: "MANUAL", categorySlugs: ["muzik"] },
    { name: "ElevenLabs", websiteUrl: "https://elevenlabs.io", description: "Gerçekçi yapay zeka ses sentezleme aracı. Ses klonlama ve çok dilli metin okuma desteği sunar.", starsCount: 0, source: "MANUAL", categorySlugs: ["ses"] },
    { name: "HeyGen", websiteUrl: "https://heygen.com", description: "Yapay zeka video avatarları oluşturma platformu. Metni gerçekçi konuşan avatar videolarına dönüştürür.", starsCount: 0, source: "MANUAL", categorySlugs: ["video"] },
    { name: "Synthesia", websiteUrl: "https://synthesia.io", description: "Kurumsal yapay zeka video üretim platformu. 140+ dilde yapay zeka avatarları ile video oluşturur.", starsCount: 0, source: "MANUAL", categorySlugs: ["video"] },
    { name: "Notion AI", websiteUrl: "https://notion.so/product/ai", description: "Notion'un yapay zeka asistanı. Not alma, özetleme, beyin fırtınası ve yazma işlemlerine yardımcı olur.", starsCount: 0, source: "MANUAL", categorySlugs: ["uretim", "metin-yazarligi"] },
    { name: "Jasper AI", websiteUrl: "https://jasper.ai", description: "Pazarlama odaklı yapay zeka içerik üretim platformu. Blog, sosyal medya ve reklam metinleri yazar.", starsCount: 0, source: "MANUAL", categorySlugs: ["metin-yazarligi", "uretim"] },
    { name: "Copy.ai", websiteUrl: "https://copy.ai", description: "Pazarlama ve satış metinleri üreten yapay zeka asistanı. E-posta, landing page ve sosyal medya içerikleri.", starsCount: 0, source: "MANUAL", categorySlugs: ["metin-yazarligi"] },
    { name: "Writesonic", websiteUrl: "https://writesonic.com", description: "SEO odaklı yapay zeka içerik üretim platformu. Blog, reklam ve ürün açıklamaları yazar.", starsCount: 0, source: "MANUAL", categorySlugs: ["metin-yazarligi", "uretim"] },
    { name: "Rytr", websiteUrl: "https://rytr.me", description: "Uygun fiyatlı yapay zeka yazma asistanı. 40+ kullanım senaryosu ile içerik üretir.", starsCount: 0, source: "MANUAL", categorySlugs: ["metin-yazarligi"] },
    { name: "Beautiful.ai", websiteUrl: "https://beautiful.ai", description: "Yapay zeka destekli sunum hazırlama aracı. Akıllı şablonlar ile profesyonel sunumlar oluşturur.", starsCount: 0, source: "MANUAL", categorySlugs: ["sunum"] },
    { name: "Gamma", websiteUrl: "https://gamma.app", description: "Yapay zeka ile sunum, belge ve web sayfası oluşturma aracı. Tek prompt ile tüm içeriği oluşturur.", starsCount: 0, source: "MANUAL", categorySlugs: ["sunum"] },
    { name: "Replit Agent", websiteUrl: "https://replit.com", description: "Replit'in yapay zeka kodlama asistanı. Doğal dilde açıklamalarla proje oluşturur.", starsCount: 0, source: "MANUAL", categorySlugs: ["kodlama"] },
    { name: "Bolt.new", websiteUrl: "https://bolt.new", description: "StackBlitz'in yapay zeka ile web uygulaması oluşturma aracı. Prompt ile full-stack uygulama geliştirir.", starsCount: 25000, githubUrl: "https://github.com/stackblitz/bolt.new", source: "MANUAL", categorySlugs: ["kodlama"] },
    { name: "Lovable", websiteUrl: "https://lovable.dev", description: "Yapay zeka ile web uygulaması geliştirme platformu. Doğal dil açıklamalarıyla ön yüz ve arka yüz oluşturur.", starsCount: 0, source: "MANUAL", categorySlugs: ["kodlama"] },
    { name: "v0.dev", websiteUrl: "https://v0.dev", description: "Vercel'in yapay zeka ile UI/UX kodlama aracı. Prompt ile React/Next.js bileşenleri oluşturur.", starsCount: 0, source: "MANUAL", categorySlugs: ["kodlama"] },
    { name: "Cody", websiteUrl: "https://sourcegraph.com/cody", description: "Sourcegraph'in yapay zeka kodlama asistanı. Kod tabanını anlar ve bağlama duyarlı yardım sağlar.", starsCount: 0, source: "MANUAL", categorySlugs: ["kodlama"] },
    { name: "Codeium", websiteUrl: "https://codeium.com", description: "Ücretsiz yapay zeka kod tamamlama aracı. 70+ dil ve 40+ IDE desteği ile Copilot alternatifi.", starsCount: 0, source: "MANUAL", categorySlugs: ["kodlama"] },
    { name: "Tabnine", websiteUrl: "https://tabnine.com", description: "Yapay zeka kod tamamlama asistanı. Yerel modeller ile çalışır ve gizlilik odaklıdır.", starsCount: 0, source: "MANUAL", categorySlugs: ["kodlama"] },
    { name: "Continue", websiteUrl: "https://continue.dev", description: "VS Code ve JetBrains için açık kaynak yapay zeka kodlama asistanı. Kendi modelini kullanabilirsin.", starsCount: 15000, githubUrl: "https://github.com/continuedev/continue", source: "MANUAL", categorySlugs: ["kodlama", "acik-kaynak"] },
    { name: "Aider", websiteUrl: "https://aider.chat", description: "Terminal tabanlı yapay zeka kodlama asistanı. Git entegrasyonu ile otomatik commit ve kod düzenleme.", starsCount: 20000, githubUrl: "https://github.com/Aider-AI/aider", source: "MANUAL", categorySlugs: ["kodlama", "acik-kaynak"] },
    { name: "OpenHands", websiteUrl: "https://openhands.app", description: "Yapay zeka yazılım geliştirme ajanı. Kod yazma, terminal komutları ve web arama yapabilir.", starsCount: 35000, githubUrl: "https://github.com/All-Hands-AI/OpenHands", source: "MANUAL", categorySlugs: ["kodlama", "acik-kaynak"] },
    { name: "AutoGPT", websiteUrl: "https://agpt.co", description: "Otonom yapay zeka ajanı platformu. Karmaşık görevleri alt görevlere bölüp otonom olarak tamamlar.", starsCount: 160000, githubUrl: "https://github.com/Significant-Gravitas/AutoGPT", source: "MANUAL", categorySlugs: ["uretim", "acik-kaynak"] },
    { name: "LangChain", websiteUrl: "https://langchain.com", description: "Yapay zeka uygulamaları geliştirme framework'ü. LLM'leri zincirleme ve araçlarla entegre etme.", starsCount: 85000, githubUrl: "https://github.com/langchain-ai/langchain", source: "MANUAL", categorySlugs: ["kodlama", "acik-kaynak"] },
    { name: "LlamaIndex", websiteUrl: "https://llamaindex.ai", description: "Özel verilerle yapay zeka uygulamaları geliştirme framework'ü. RAG (Retrieval Augmented Generation) için idealdir.", starsCount: 30000, githubUrl: "https://github.com/run-llama/llama_index", source: "MANUAL", categorySlugs: ["kodlama", "acik-kaynak"] },
    { name: "CrewAI", websiteUrl: "https://crewai.com", description: "Çoklu yapay zeka ajanları orkestrasyon framework'ü. Birden çok AI ajanını birlikte çalıştırmak için.", starsCount: 20000, githubUrl: "https://github.com/crewAIInc/crewAI", source: "MANUAL", categorySlugs: ["uretim", "acik-kaynak"] },
  ];

  for (const rawTool of tools) {
    const slug = toolSlugify(rawTool.name);

    const exists = await prisma.aiTool.findUnique({ where: { slug } });
    if (exists) {
      console.log(`  Skip (exists): ${rawTool.name}`);
      continue;
    }

    console.log(`  Enriching: ${rawTool.name}...`);

    try {
      const enriched = await enrichTool(rawTool);
      const pricingEnum = enriched.pricingModel.toLowerCase().includes("ücretsiz") ? "FREE"
        : enriched.pricingModel.toLowerCase().includes("freemium") ? "FREEMIUM"
        : enriched.pricingModel.toLowerCase().includes("açık") ? "OPEN_SOURCE"
        : "FREE";

      const tool = await prisma.aiTool.create({
        data: {
          slug,
          name: rawTool.name,
          descriptionTr: enriched.descriptionTr,
          websiteUrl: rawTool.websiteUrl || null,
          githubUrl: rawTool.githubUrl || null,
          starsCount: rawTool.starsCount || 0,
          source: "MANUAL",
          featured: false,
          metaTitle: enriched.metaTitle || null,
          metaDescription: enriched.metaDescription || null,
          useCases: enriched.useCases || [],
          pricingModel: pricingEnum as never,
          hardwareReq: enriched.hardwareReq || null,
          bestFor: enriched.bestFor || null,
        },
      });

      if (rawTool.categorySlugs && rawTool.categorySlugs.length > 0) {
        for (const catSlug of rawTool.categorySlugs) {
          const category = await prisma.category.findUnique({ where: { slug: catSlug } });
          if (category) {
            await prisma.toolCategory.create({
              data: { toolId: tool.id, categoryId: category.id },
            }).catch(() => {});
          }
        }
      }

      console.log(`  ✓ ${rawTool.name}`);
    } catch (err) {
      console.error(`  ✗ ${rawTool.name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Create initial comparisons
  const comparisons = [
    { slug: "chatgpt-vs-claude", toolA: "ChatGPT", toolB: "Claude 3.5 Sonnet",
      content: { table: {
        "fiyat": ["$20/ay (Plus)", "$20/ay (Pro)"],
        "bağlam penceresi": ["128K token", "200K token"],
        "multimodal": ["Evet (GPT-4o)", "Evet"],
        "kodlama": ["İyi", "Çok İyi"],
        "Türkçe destek": ["Mükemmel", "İyi"],
      }} },
    { slug: "chatgpt-vs-github-copilot", toolA: "ChatGPT", toolB: "GitHub Copilot",
      content: { table: {
        "fiyat": ["$20/ay (Plus)", "$10/ay"],
        "kullanım alanı": ["Genel amaçlı", "Kod yazma"],
        "IDE entegrasyonu": ["Sınırlı", "Mükemmel"],
        "kod kalitesi": ["İyi", "Çok İyi"],
        "Türkçe destek": ["Mükemmel", "Sınırlı"],
      }} },
    { slug: "midjourney-vs-dall-e-3", toolA: "Midjourney", toolB: "DALL-E 3",
      content: { table: {
        "fiyat": ["$10-60/ay", "$20/ay (ChatGPT Plus)"],
        "görsel kalitesi": ["Sanatsal, yaratıcı", "Gerçekçi, detaylı"],
        "kontrol": ["Yüksek (parametreler)", "Orta"],
        "kullanım": ["Discord üzerinden", "ChatGPT arayüzü"],
        "Ticari kullanım": ["Evet", "Evet"],
      }} },
  ];

  for (const cmp of comparisons) {
    const toolA = await prisma.aiTool.findUnique({ where: { slug: toolSlugify(cmp.toolA) } });
    const toolB = await prisma.aiTool.findUnique({ where: { slug: toolSlugify(cmp.toolB) } });
    if (toolA && toolB) {
      await prisma.comparison.upsert({
        where: { slug: cmp.slug },
        update: {},
        create: {
          slug: cmp.slug,
          toolAId: toolA.id,
          toolBId: toolB.id,
          contentTr: cmp.content as never,
        },
      });
      console.log(`  Comparison: ${cmp.toolA} vs ${cmp.toolB}`);
    }
  }

  // Create sample prompts
  const chatgpt = await prisma.aiTool.findUnique({ where: { slug: toolSlugify("ChatGPT") } });
  if (chatgpt) {
    const prompts = [
      { title: "Türkçe Blog Yazma Promptu", promptText: "Aşağıdaki konu hakkında SEO uyumlu, 1000 kelimelik bir blog yazısı yaz: [konu]. Hedef kitle: Türkçe konuşan profesyoneller. Stil: Bilgilendirici ve akıcı. Anahtar kelimeler: [anahtar_kelimeler]. Başlık H2 formatında olsun.", useCase: "SEO uyumlu blog içeriği oluşturma" },
      { title: "Kod Açıklama ve Refactor", promptText: "Aşağıdaki kodu analiz et, ne yaptığını açıkla ve daha iyi bir versiyonunu yaz. Kod:\n```\n[kod]\n```", useCase: "Kod inceleme ve iyileştirme" },
      { title: "İş E-postası Yazma", promptText: "Bir [alıcı pozisyonu]'na [konu] hakkında profesyonel bir e-posta taslağı yaz. Ton: [resmi/yarı resmi/samimi]. E-posta şunları içermeli: [içerik maddeleri].", useCase: "Profesyonel e-posta yazma" },
    ];

    const sohbetCat = await prisma.category.findUnique({ where: { slug: categorySlugify("sohbet") } });

    for (const p of prompts) {
      await prisma.prompt.upsert({
        where: { id: p.title },
        update: {},
        create: {
          title: p.title,
          promptText: p.promptText,
          useCase: p.useCase,
          toolId: chatgpt.id,
          categoryId: sohbetCat?.id,
        },
      });
    }
    console.log("  Prompts: ChatGPT prompts created");
  }

  console.log("\nSeed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
