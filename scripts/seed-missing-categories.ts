import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting MASSIVE seeding for empty categories...");

  // Fetch all categories
  let dbCategories = await prisma.category.findMany();
  
  // Helper to get or create category
  const getOrCreateCategory = async (nameTr: string, slug: string) => {
    let cat = dbCategories.find(c => c.slug === slug || c.nameTr === nameTr);
    if (!cat) {
      cat = await prisma.category.create({ data: { nameTr, slug } });
      dbCategories.push(cat);
      console.log(`Created missing category: ${nameTr}`);
    }
    return cat.id;
  };

  const catSohbet = await getOrCreateCategory("Sohbet", "sohbet");
  const catGorsel = await getOrCreateCategory("Görsel Üretimi", "gorsel-uretimi");
  const catVideo = await getOrCreateCategory("Video", "video");
  const catSes = await getOrCreateCategory("Ses", "ses");
  const catMuzik = await getOrCreateCategory("Müzik", "muzik");

  const massiveTools = [
    // --- SOHBET ---
    {
      name: "ChatGPT", slug: "chatgpt-nedir", websiteUrl: "https://chatgpt.com", pricingModel: "FREEMIUM", bestFor: "Herkes", source: "MANUAL",
      categories: [catSohbet], useCases: ["Metin Yazarlığı", "Kodlama", "Analiz"],
      metaTitle: "ChatGPT Nedir? OpenAI Yapay Zeka Sohbet Botu", metaDescription: "Dünyanın en popüler yapay zeka asistanı. Kod yazmaktan şiir yazmaya kadar her şeyi yapabilen ChatGPT rehberi.",
      descriptionTr: `<h2>ChatGPT Nedir?</h2><p>OpenAI tarafından geliştirilen ve dünyayı yapay zeka ile tanıştıran devrimsel sohbet botudur. GPT-3.5 ve GPT-4o modelleriyle çalışır.</p><h2>Avantajlar</h2><ul><li>Türkçe dilinde inanılmaz başarılıdır.</li><li>Sesli sohbet (Voice Mode) özelliği devrimseldir.</li><li>Özel GPT'ler oluşturabilirsiniz.</li></ul>`
    },
    {
      name: "Claude 3.5 Sonnet", slug: "claude-nedir", websiteUrl: "https://claude.ai", pricingModel: "FREEMIUM", bestFor: "Yazılımcılar, Yazarlar", source: "MANUAL",
      categories: [catSohbet], useCases: ["Kod Yazımı", "Uzun Makale Analizi", "Yaratıcı Yazarlık"],
      metaTitle: "Claude 3.5 Sonnet Nedir? Anthropic Yapay Zeka", metaDescription: "İnsan gibi yazabilen ve inanılmaz kodlama yetenekleri olan Claude 3.5 Sonnet incelemesi.",
      descriptionTr: `<h2>Claude Nedir?</h2><p>Anthropic tarafından geliştirilen Claude, özellikle yaratıcı metin yazarlığı ve kodlama (Artifacts özelliği) konularında ChatGPT'nin en büyük rakibidir.</p><h2>Neden Claude?</h2><ul><li>Çok daha doğal, robotsuz ve "insansı" yazar.</li><li>Artifacts ekranı sayesinde yazdığı kodu yan pencerede canlı olarak çalıştırır (React, HTML oyunlar vb.).</li><li>Büyük PDF'leri (200K token) saniyeler içinde okur.</li></ul>`
    },
    {
      name: "Perplexity AI", slug: "perplexity-nedir", websiteUrl: "https://perplexity.ai", pricingModel: "FREEMIUM", bestFor: "Araştırmacılar, Öğrenciler", source: "MANUAL",
      categories: [catSohbet], useCases: ["Web Araması", "Akademik Araştırma", "Haber Takibi"],
      metaTitle: "Perplexity AI Nedir? Yapay Zeka Arama Motoru", metaDescription: "Google'ı tahtından eden AI arama motoru. Sorularınızı internette tarayıp kaynak göstererek yanıtlayan Perplexity.",
      descriptionTr: `<h2>Perplexity Nedir?</h2><p>Geleneksel arama motorlarının (Google) yerini alan, sorularınıza web sitelerini okuyarak, özetleyerek ve <strong>kaynak (dipnot) göstererek</strong> yanıt veren yapay zeka arama motorudur.</p><h2>Özellikleri</h2><ul><li>Asla halüsinasyon (uydurma) yapmaz çünkü her cümleyi bir web sitesine dayandırır.</li><li>Pro Search özelliği ile çok katmanlı, derinlemesine araştırmalar yapar.</li><li>Video ve görsel araması entegredir.</li></ul>`
    },
    {
      name: "Pi (Inflection)", slug: "pi-ai-nedir", websiteUrl: "https://pi.ai", pricingModel: "FREE", bestFor: "Duygusal Destek, Günlük Sohbet", source: "MANUAL",
      categories: [catSohbet], useCases: ["Kişisel Asistan", "Sesli Sohbet", "Fikir Alışverişi"],
      metaTitle: "Pi AI Nedir? En Duygusal Yapay Zeka", metaDescription: "Sizinle empati kuran, arkadaş gibi sohbet eden ve harika bir sese sahip Pi yapay zekası.",
      descriptionTr: `<h2>Pi Nedir?</h2><p>Inflection AI tarafından geliştirilen Pi, "Personal Intelligence" (Kişisel Zeka) kelimesinin kısaltmasıdır. Görevi kod yazmak veya karmaşık matematik çözmek değil, size <strong>empatiyle yaklaşan bir arkadaş</strong> olmaktır.</p><h2>Öne Çıkanlar</h2><ul><li>Dünyanın en doğal ve insan gibi hissettiren ses sentezine sahiptir. Sesli sohbet modunda gerçek bir insanla telefonla konuşuyormuş gibi hissedersiniz.</li><li>Sizi yargılamaz, aktif dinleme yapar.</li></ul>`
    },
    {
      name: "Mistral Le Chat", slug: "mistral-le-chat", websiteUrl: "https://chat.mistral.ai", pricingModel: "FREE", bestFor: "Geliştiriciler, Avrupalılar", source: "MANUAL",
      categories: [catSohbet], useCases: ["Kodlama", "Çok Dilli Analiz"],
      metaTitle: "Mistral Le Chat Nedir? Avrupa'nın Yapay Zekası", metaDescription: "Fransız Mistral AI tarafından geliştirilen açık kaynak odaklı hızlı ve zeki sohbet botu.",
      descriptionTr: `<h2>Mistral Nedir?</h2><p>Fransa merkezli Mistral AI'ın geliştirdiği Mistral Large modellerini kullanan sohbet botudur. Açık kaynak dünyasının en güçlü modellerini barındırır.</p>`
    },
    {
      name: "Groq", slug: "groq-nedir", websiteUrl: "https://groq.com", pricingModel: "FREE", bestFor: "Hız Arayanlar", source: "MANUAL",
      categories: [catSohbet], useCases: ["Gerçek Zamanlı Sohbet", "Hızlı Kod Üretimi"],
      metaTitle: "Groq LPU Nedir? Dünyanın En Hızlı Yapay Zekası", metaDescription: "Saniyede 800 kelime üretebilen, LPU işlemcileriyle çalışan ultra hızlı yapay zeka Groq.",
      descriptionTr: `<h2>Groq Nedir?</h2><p>Groq bir yapay zeka modeli değil, özel donanım (LPU) şirketidir. Kendi arayüzlerinde Llama 3 veya Mixtral gibi açık kaynak modelleri saniyede yüzlerce token hızında (insan gözünün okuyamayacağı kadar hızlı) çalıştırırlar.</p>`
    },

    // --- GORSEL URETIMI ---
    {
      name: "Midjourney", slug: "midjourney-nedir", websiteUrl: "https://midjourney.com", pricingModel: "PAID", bestFor: "Sanatçılar, Tasarımcılar", source: "MANUAL",
      categories: [catGorsel], useCases: ["Konsept Sanat", "Fotogerçekçi Çekim", "Logo Tasarımı"],
      metaTitle: "Midjourney v6 Nedir? Yapay Zeka ile Görsel Üretimi", metaDescription: "Dünyanın en kaliteli görsellerini üreten Midjourney AI kullanımı, Discord komutları ve rehberi.",
      descriptionTr: `<h2>Midjourney Nedir?</h2><p>Tartışmasız olarak dünyanın en estetik ve fotogerçekçi görsellerini üretebilen yapay zeka modelidir. Uzun süre Discord üzerinden komutlarla (/imagine) kullanıldıktan sonra web arayüzüne de geçiş yapmıştır.</p><h2>Özellikleri</h2><ul><li>İnsan derisi, ışık yansımaları ve film greni gibi detaylarda kusursuzdur.</li><li>Karakter tutarlılığı (Character Reference) ile aynı kişiyi farklı sahnelerde çizebilir.</li></ul>`
    },
    {
      name: "DALL-E 3", slug: "dalle-3-nedir", websiteUrl: "https://chatgpt.com", pricingModel: "PAID", bestFor: "İçerik Üreticileri, Pazarlamacılar", source: "MANUAL",
      categories: [catGorsel], useCases: ["İllüstrasyon", "Sosyal Medya Görselleri", "Metin İçeren Resimler"],
      metaTitle: "DALL-E 3 Nedir? OpenAI Görsel Oluşturucu", metaDescription: "ChatGPT içine entegre çalışan, komutları (prompt) en iyi anlayan görsel yapay zeka DALL-E 3.",
      descriptionTr: `<h2>DALL-E 3 Nedir?</h2><p>OpenAI'nin görsel üretim modelidir. Midjourney'den farklı olarak, yazdığınız uzun metinleri (prompt) tam olarak ve eksiksiz uygular. Görsellerin içine hatasız <strong>İngilizce yazılar ve logolar</strong> yerleştirebilir.</p>`
    },
    {
      name: "Ideogram AI", slug: "ideogram-nedir", websiteUrl: "https://ideogram.ai", pricingModel: "FREEMIUM", bestFor: "Tişört Tasarımcıları, Tipografi", source: "MANUAL",
      categories: [catGorsel], useCases: ["Yazılı Görsel Tasarımı", "Poster Yapımı", "Meme Üretimi"],
      metaTitle: "Ideogram AI Nedir? Tipografi Odaklı Yapay Zeka", metaDescription: "Görsellerin üzerine kusursuz metinler yazabilen Ideogram AI ile logo ve poster tasarımları yapın.",
      descriptionTr: `<h2>Ideogram Nedir?</h2><p>Görsellerin içine hatasız yazılar yazma konusunda piyasanın açık ara en iyi aracıdır. Tişört baskıları, neon tabelalar, afişler ve logolar tasarlamak için vazgeçilmezdir.</p>`
    },
    {
      name: "Leonardo AI", slug: "leonardo-ai-nedir", websiteUrl: "https://leonardo.ai", pricingModel: "FREEMIUM", bestFor: "Oyun Geliştiriciler, İllüstratörler", source: "MANUAL",
      categories: [catGorsel], useCases: ["Oyun Varlıkları (Assets)", "Gerçek Zamanlı Çizim (Canvas)", "3D Doku Üretimi"],
      metaTitle: "Leonardo AI Nedir? Gelişmiş Görsel Stüdyosu", metaDescription: "Çoklu model desteği ve gelişmiş tuval özellikleriyle Midjourney'in en güçlü ücretsiz alternatifi Leonardo AI.",
      descriptionTr: `<h2>Leonardo AI Nedir?</h2><p>Stable Diffusion tabanlı modelleri harika bir web arayüzüyle sunan, çok fazla kontrol ve ince ayar (ControlNet, Realtime Canvas) barındıran devasa bir yapay zeka sanat stüdyosudur.</p>`
    },
    {
      name: "Krea AI", slug: "krea-ai-nedir", websiteUrl: "https://krea.ai", pricingModel: "FREEMIUM", bestFor: "Mimarlar, Tasarımcılar", source: "MANUAL",
      categories: [catGorsel], useCases: ["Gerçek Zamanlı Render", "Görsel Yükseltme (Upscale)"],
      metaTitle: "Krea AI Nedir? Gerçek Zamanlı AI Çizim", metaDescription: "Siz fırçayla çizerken veya kameranızı oynatırken anında render alan gerçek zamanlı görsel AI.",
      descriptionTr: `<h2>Krea AI Nedir?</h2><p>Gerçek zamanlı (Real-time) üretim konusunda uzmandır. Siz sol ekranda basit şekiller çizerken, sağ ekranda gecikmesiz olarak fotogerçekçi çıktılar üretir. Ayrıca 4K'ya kadar çok kaliteli çözünürlük artırma (Enhance/Upscale) aracı vardır.</p>`
    },

    // --- VIDEO ---
    {
      name: "Sora (OpenAI)", slug: "sora-nedir", websiteUrl: "https://openai.com/sora", pricingModel: "PAID", bestFor: "Yönetmenler, Stüdyolar", source: "MANUAL",
      categories: [catVideo], useCases: ["Fizik Kurallarına Uyan Video", "Uzun Süreli Üretim"],
      metaTitle: "OpenAI Sora Nedir? Yapay Zeka Video Devrimi", metaDescription: "Dünyanın fizik kurallarını anlayarak 1 dakikalık kusursuz videolar üretebilen OpenAI Sora modeli.",
      descriptionTr: `<h2>Sora Nedir?</h2><p>OpenAI'nin henüz genel kullanıma açmadığı ancak sektörü şoka uğratan video modelidir. Rakipleri 4 saniyelik hatalı videolar üretirken, Sora nesnelerin fiziksel özelliklerini (su yansıması, yerçekimi) koruyarak 60 saniyeye kadar inanılmaz tutarlı videolar üretebilmektedir.</p>`
    },
    {
      name: "Pika Labs", slug: "pika-labs-nedir", websiteUrl: "https://pika.art", pricingModel: "FREEMIUM", bestFor: "Animatörler, Sosyal Medya", source: "MANUAL",
      categories: [catVideo], useCases: ["Lip Sync (Dudak Senkronizasyonu)", "Stil Değiştirme", "Video Genişletme (Outpaint)"],
      metaTitle: "Pika Labs Nedir? Yapay Zeka Video Düzenleme", metaDescription: "Metinden video üretme, karakter konuşturma ve videolara nesne ekleme konusunda devrim yaratan Pika AI.",
      descriptionTr: `<h2>Pika Nedir?</h2><p>Discord botu olarak başlayıp muazzam bir web platformuna dönüşen Pika, Runway'in en büyük rakibidir. Videolardaki karakterlerin dudaklarını girdiğiniz sese göre oynatabilir (Lip Sync) veya videoya belirli nesneler ekleyip çıkarabilir (Inpainting).</p>`
    },
    {
      name: "Synthesia", slug: "synthesia-nedir", websiteUrl: "https://synthesia.io", pricingModel: "PAID", bestFor: "Kurumsal Eğitim, İK", source: "MANUAL",
      categories: [catVideo], useCases: ["Eğitim Videoları", "Avatarlı Sunum", "Çok Dilli Çeviri"],
      metaTitle: "Synthesia AI Nedir? Yapay Zeka Sunucu Üretimi", metaDescription: "Kurumsal şirketlerin tercihi Synthesia ile kameralara ihtiyaç duymadan profesyonel eğitim videoları hazırlayın.",
      descriptionTr: `<h2>Synthesia Nedir?</h2><p>HeyGen'in kurumsal alandaki en büyük rakibi ve pazarın öncüsüdür. Binlerce hazır şablon, profesyonel şirket avatarları ve 120+ dil desteği ile metni saniyeler içinde sunum videosuna çevirir.</p>`
    },
    {
      name: "Luma Dream Machine", slug: "luma-dream-machine", websiteUrl: "https://lumalabs.ai/dream-machine", pricingModel: "FREEMIUM", bestFor: "İçerik Üreticileri", source: "MANUAL",
      categories: [catVideo], useCases: ["Hızlı Video Üretimi", "Meme Videoları", "Keyframe Geçişleri"],
      metaTitle: "Luma Dream Machine Nedir? AI Video Üretimi", metaDescription: "Sora kalitesine en çok yaklaşan, halka açık ve çok hızlı metinden video üretme platformu Luma Dream Machine.",
      descriptionTr: `<h2>Luma Dream Machine Nedir?</h2><p>Luma AI'ın piyasaya sürdüğü bu model, Sora'nın yokluğunda piyasayı domine etmiştir. İlk kare (Start Frame) ve son kare (End Frame) vererek ortadaki akışı yapay zekanın mükemmel bağlamasını sağlayabilirsiniz.</p>`
    },

    // --- SES ---
    {
      name: "Murf AI", slug: "murf-ai-nedir", websiteUrl: "https://murf.ai", pricingModel: "FREEMIUM", bestFor: "E-Öğrenme, Reklamcılar", source: "MANUAL",
      categories: [catSes], useCases: ["Stüdyo Kalitesinde Seslendirme", "Video Dublajı"],
      metaTitle: "Murf AI Nedir? Profesyonel Yapay Zeka Seslendirmen", metaDescription: "Reklam filmleri ve YouTube videoları için duygulu ve vurgulu yapay zeka seslendirme aracı Murf.",
      descriptionTr: `<h2>Murf AI Nedir?</h2><p>ElevenLabs'a kıyasla daha kurumsal, reklam ve e-öğrenme (LMS) odaklı bir seslendirme platformudur. Gelişmiş bir ses kurgu ekranı sunar; videonuzu platforma yükleyip saniyeleri tutturarak tam zamanlı seslendirme blokları oluşturabilirsiniz.</p>`
    },
    {
      name: "Play.ht", slug: "play-ht-nedir", websiteUrl: "https://play.ht", pricingModel: "FREEMIUM", bestFor: "Podcast Üreticileri", source: "MANUAL",
      categories: [catSes], useCases: ["Makaleyi Sese Çevirme", "API Entegrasyonu", "Ses Klonlama"],
      metaTitle: "Play.ht Nedir? Yapay Zeka Ses Jeneratörü", metaDescription: "Blog yazılarınızı ve makalelerinizi saniyeler içinde kaliteli sesli kitaplara ve podcastlere dönüştüren yapay zeka.",
      descriptionTr: `<h2>Play.ht Nedir?</h2><p>Daha çok API hizmetleri ve uzun metrajlı makalelerin podcast formatına dönüştürülmesi ile bilinen çok kaliteli bir TTS (Metinden Sese) aracıdır.</p>`
    },
    {
      name: "Resemble AI", slug: "resemble-ai-nedir", websiteUrl: "https://resemble.ai", pricingModel: "PAID", bestFor: "Oyun Stüdyoları, Geliştiriciler", source: "MANUAL",
      categories: [catSes], useCases: ["Oyun Karakteri Seslendirme", "Derin Ses Klonlama (Deepfake Koruma)"],
      metaTitle: "Resemble AI Nedir? Oyunlar İçin Yapay Zeka Sesi", metaDescription: "Unity entegrasyonu ve gerçek zamanlı API ile oyun karakterlerini dinamik olarak seslendiren yapay zeka.",
      descriptionTr: `<h2>Resemble AI Nedir?</h2><p>Ses klonlamanın yanı sıra, klonlanan sesleri Unity gibi oyun motorlarına entegre etmeye odaklanan platformdur. Sesin içine güvenlik amaçlı filigran (watermark) ekleyerek kötü niyetli ses klonlamalarının (deepfake) tespit edilmesini sağlar.</p>`
    },

    // --- MUZIK ---
    {
      name: "Udio", slug: "udio-nedir", websiteUrl: "https://udio.com", pricingModel: "FREEMIUM", bestFor: "Müzisyenler, Prodüktörler", source: "MANUAL",
      categories: [catMuzik], useCases: ["Tam Şarkı Üretimi", "Şarkı Uzatma", "Remix Yapma"],
      metaTitle: "Udio Nedir? En Kaliteli Yapay Zeka Müzik Üreticisi", metaDescription: "Suno'nun en büyük rakibi. Akıl almaz vokal gerçekçiliği ve master edilmiş ses kalitesi sunan Udio AI.",
      descriptionTr: `<h2>Udio Nedir?</h2><p>Suno ile birlikte yapay zeka müzik dünyasının zirvesinde yer alır. Birçok prodüktöre göre <strong>ses kalitesi (audio fidelity) ve vokal gerçekçiliği</strong> açısından Suno'dan bile daha iyidir. Şarkıları çok net parçalara bölerek uzatmanıza (Extend) imkan verir.</p>`
    },
    {
      name: "Soundraw", slug: "soundraw-nedir", websiteUrl: "https://soundraw.io", pricingModel: "FREEMIUM", bestFor: "YouTube İçerik Üreticileri, Vloggers", source: "MANUAL",
      categories: [catMuzik], useCases: ["Telif Hakksız Arka Plan Müziği", "Vlog Müziği"],
      metaTitle: "Soundraw Nedir? Telifsiz Yapay Zeka Müzik", metaDescription: "Videonuzun moduna ve hızına göre tamamen telifsiz (royalty-free) müzikler bestelemenizi sağlayan Soundraw.",
      descriptionTr: `<h2>Soundraw Nedir?</h2><p>Şarkı sözü veya vokal üretmez; amacı YouTube veya reklam videolarınızın arka planına koyabileceğiniz, telif hakkı sorunu yaşatmayacak <strong>enstrümantal beatler ve müzikler</strong> üretmektir. Şarkının neresinin coşkulu, neresinin sakin olacağını harita üzerinden çizebilirsiniz.</p>`
    },
    {
      name: "Mubert", slug: "mubert-nedir", websiteUrl: "https://mubert.com", pricingModel: "FREEMIUM", bestFor: "Elektronik Müzik Severler, Yayıncılar", source: "MANUAL",
      categories: [catMuzik], useCases: ["Sonsuz Canlı Yayın Müziği", "Elektronik Müzik Beatleri"],
      metaTitle: "Mubert Nedir? Sonsuz Yapay Zeka Müziği", metaDescription: "Canlı yayınlar (Twitch) için sonsuz döngüde telifsiz lo-fi ve elektronik müzikler üreten Mubert yapay zekası.",
      descriptionTr: `<h2>Mubert Nedir?</h2><p>İnsan sanatçılar tarafından sağlanan sample'ları (örnek sesleri) algoritmik olarak birleştiren yapay zekadır. Özellikle Twitch yayıncıları için saatlerce durmadan çalan "Lo-Fi" radyoları veya elektronik müzik setleri yaratmak için harikadır.</p>`
    }
  ];

  for (const t of massiveTools) {
    await prisma.aiTool.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        websiteUrl: t.websiteUrl,
        pricingModel: t.pricingModel as any,
        bestFor: t.bestFor,
        useCases: t.useCases,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
        descriptionTr: t.descriptionTr,
        categories: {
          deleteMany: {},
          create: t.categories.map(id => ({
            category: { connect: { id } }
          }))
        }
      },
      create: {
        slug: t.slug,
        name: t.name,
        websiteUrl: t.websiteUrl,
        pricingModel: t.pricingModel as any,
        bestFor: t.bestFor,
        useCases: t.useCases,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
        descriptionTr: t.descriptionTr,
        source: t.source as any,
        categories: {
          create: t.categories.map(id => ({
            category: { connect: { id } }
          }))
        }
      }
    });
    console.log(`✓ Inserted: ${t.name}`);
  }

  console.log(`Successfully added ${massiveTools.length} tools to exact categories!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
