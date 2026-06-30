import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting blog seeding...");

  // Find tools in database to connect them
  const cursor = await prisma.aiTool.findUnique({ where: { slug: "cursor-nedir" } });
  const windsurf = await prisma.aiTool.findUnique({ where: { slug: "windsurf-nedir" } });
  const copilot = await prisma.aiTool.findUnique({ where: { slug: "github-copilot-nedir" } });

  const chatgpt = await prisma.aiTool.findUnique({ where: { slug: "chatgpt-nedir" } });
  const claude = await prisma.aiTool.findUnique({ where: { slug: "claude-3-5-sonnet-nedir" } });

  const ollama = await prisma.aiTool.findUnique({ where: { slug: "ollama-nedir" } });
  const lmstudio = await prisma.aiTool.findUnique({ where: { slug: "lm-studio-nedir" } });

  const posts = [
    {
      slug: "cursor-vs-windsurf-vs-copilot-yapay-zeka-kod-editorleri",
      title: "Cursor vs Windsurf vs GitHub Copilot: 2026'nın En İyi Yapay Zeka Editörleri",
      excerpt: "Yazılım dünyasını değiştiren yapay zeka kod asistanlarını karşılaştırıyoruz. Cursor, Windsurf ve GitHub Copilot arasından hangisi yazılımcılar için daha avantajlı?",
      readTime: 8,
      author: "Muhammet Yakac",
      featured: true,
      metaTitle: "Cursor vs Windsurf vs Copilot: Hangisi Daha İyi? | 2026",
      metaDescription: "Yapay zeka kodlama editörleri karşılaştırması. Cursor, Windsurf ve GitHub Copilot özellik farkları, fiyatlandırma ve IDE entegrasyonu detayları.",
      contentTr: `
        <h2>Yazılım Geliştirmede Yapay Zeka Devrimi</h2>
        <p>Yazılım dünyası son iki yılda inanılmaz bir hızla dönüştü. Artık kod yazarken sadece stackoverflow aramaları yapmıyoruz, yanımızda 7/24 çalışan kıdemli bir yapay zeka ortağımız var. Bu alanda öne çıkan üç büyük devi karşılaştırıyoruz: <strong>Cursor</strong>, <strong>Windsurf</strong> ve <strong>GitHub Copilot</strong>.</p>
        
        <h2>1. Cursor: VS Code Temelli AI Lideri</h2>
        <p>Cursor, VS Code editörünü çatallayarak (fork) doğrudan yapay zeka odaklı geliştiren ilk popüler IDE'dir. Arayüzün tam göbeğine yerleştirilmiş Claude 3.5 Sonnet ve GPT-4o entegrasyonu sayesinde kod tabanınızı bir bütün olarak anlayabilir.</p>
        <h3>Cursor'ın Öne Çıkan Özellikleri:</h3>
        <ul>
          <li><strong>Composer:</strong> Aynı anda birden fazla dosyayı düzenleyip yeni sayfalar ve modüller oluşturabilir.</li>
          <li><strong>Chat & Cmd+K:</strong> Kod satırındayken hızlıca düzenleme yapabilir veya yan panelde tüm kod tabanı hakkında soru sorabilirsiniz.</li>
          <li><strong>Tab Autocomplete:</strong> Yazacağınız sonraki satırı veya kelimeyi tahmin ederek akıllı tamamlama sağlar.</li>
        </ul>

        <h2>2. Windsurf: Codeium'un Devrim Niteliğindeki IDE'si</h2>
        <p>Codeium ekibi tarafından geliştirilen Windsurf, kendisini ilk "Ajan tabanlı IDE" olarak tanımlıyor. Cursor'dan en büyük farkı, verdiğiniz komutları sadece önermekle kalmayıp kendi terminalinde çalıştırarak, hata ayıklayarak ve internette arayarak otonom şekilde tamamlayabilmesidir.</p>
        <h3>Windsurf Neden Farklı?</h3>
        <p>Windsurf, karmaşık hata ayıklama süreçlerinde kendi yazdığı kodun çalışıp çalışmadığını test eder. Eğer hata alırsa, hatayı otomatik olarak düzeltene kadar süreci tekrarlar. Bu, yazılımcının üzerindeki bilişsel yükü büyük oranda hafifletir.</p>

        <h2>3. GitHub Copilot: Klasik ve Güvenilir Eklenti</h2>
        <p>GitHub Copilot, bağımsız bir IDE yerine mevcut editörlerinize (VS Code, JetBrains, Visual Studio) kurulan bir eklenti olarak çalışır. Microsoft ve OpenAI iş birliğiyle geliştirilen bu araç, devasa GitHub kod havuzuyla eğitildiği için mükemmel satır içi kod tamamlama yeteneğine sahiptir.</p>
        
        <h2>Karşılaştırma Tablosu</h2>
        <table>
          <thead>
            <tr>
              <th>Özellik</th>
              <th>Cursor</th>
              <th>Windsurf</th>
              <th>GitHub Copilot</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ajan Yetenekleri</td>
              <td>Orta (Composer ile gelişmiş)</td>
              <td>Çok Yüksek (Tam Ajan)</td>
              <td>Orta (Copilot Chat ile)</td>
            </tr>
            <tr>
              <td>Editör Tipi</td>
              <td>Ayrı IDE (VS Code Fork)</td>
              <td>Ayrı IDE</td>
              <td>IDE Eklentisi</td>
            </tr>
            <tr>
              <td>Fiyatlandırma</td>
              <td>$20/ay (Ücretsiz sürüm var)</td>
              <td>$20/ay (Ücretsiz sürüm var)</td>
              <td>$10/ay (Bireysel)</td>
            </tr>
          </tbody>
        </table>

        <h2>Sonuç: Hangisini Seçmelisiniz?</h2>
        <p>Eğer mevcut IDE düzeninizi bozmak istemiyor ve hızlı kod tamamlama arıyorsanız <strong>GitHub Copilot</strong> en mantıklı seçimdir. Ancak kod tabanınızı baştan aşağı analiz eden, sizin yerinize birden fazla dosyayı güncelleyen ve projeyi otonom şekilde yöneten bir yapay zeka istiyorsanız <strong>Windsurf</strong> veya <strong>Cursor</strong> kesinlikle denemeniz gereken araçlardır.</p>
      `,
      toolIds: [cursor?.id, windsurf?.id, copilot?.id].filter(Boolean) as string[],
    },
    {
      slug: "chatgpt-vs-claude-3-5-sonnet-karsilastirma",
      title: "ChatGPT mi, Claude 3.5 Sonnet mi? Günlük İşler İçin Hangisi Daha İyi?",
      excerpt: "OpenAI'nin GPT-4o modeli ile Anthropic'in Claude 3.5 Sonnet modelini karşı karşıya getiriyoruz. Hangisi daha zeki, daha doğal ve daha faydalı?",
      readTime: 6,
      author: "Muhammet Yakac",
      featured: false,
      metaTitle: "ChatGPT vs Claude 3.5 Sonnet Karşılaştırması | eniyiyapayzeka",
      metaDescription: "Yapay zeka sohbet modelleri karşılaştırması. GPT-4o ve Claude 3.5 Sonnet metin yazımı, Türkçe kalitesi, kod yazma ve mantık yürütme farkları.",
      contentTr: `
        <h2>Yapay Zekanın İki Zirvesi</h2>
        <p>Yapay zeka dünyasının en çok karşılaştırılan iki büyük dil modeli şüphesiz <strong>ChatGPT (GPT-4o)</strong> ve <strong>Claude 3.5 Sonnet</strong>. Her iki model de günlük yaşantımızda e-posta yazmaktan kod yazmaya, özet çıkarmaktan karmaşık problemleri çözmeye kadar her alanda yardımcımız oluyor. Peki hangisi hangi alanda daha başarılı?</p>

        <h2>ChatGPT (GPT-4o): Hızlı, Pratik ve Multimodal</h2>
        <p>OpenAI'nin en güncel modeli olan GPT-4o, çok modlu (multimodal) çalışma yeteneğinde bir numara. Sesli sohbet hızı, görselleri anlama ve analiz etme kapasitesi son derece gelişmiş durumda. Ayrıca internet erişimi ve dahili DALL-E 3 görsel üretim entegrasyonu sayesinde tam bir İsviçre çakısı.</p>
        
        <h2>Claude 3.5 Sonnet: Edebi Türkçe, Kodlama ve Analiz</h2>
        <p>Anthropic tarafından geliştirilen Claude 3.5 Sonnet, son zamanların en sevilen modeli haline geldi. Bunun en büyük sebebi, ürettiği Türkçe metinlerin kulağa ChatGPT gibi 'yapay' gelmemesi, son derece doğal ve edebi olmasıdır. Ayrıca kod yazarken hata yapma oranı GPT modellerine göre oldukça düşüktür.</p>

        <h2>Modellerin Güçlü Yanları</h2>
        <ul>
          <li><strong>Metin Yazarlığı:</strong> Claude 3.5 Sonnet, doğal ve yaratıcı Türkçe kalemiyle blog yazıları ve pazarlama metinleri için açık ara daha başarılıdır.</li>
          <li><strong>Veri Analizi:</strong> ChatGPT, büyük veri dosyalarını yükleyip grafik çizdirme ve analiz etme konusunda daha pratik araçlar sunar.</li>
          <li><strong>Kodlama:</strong> Claude 3.5 Sonnet, karmaşık yazılım algoritmalarında ve hata gidermede daha doğru sonuçlar üretir.</li>
        </ul>

        <h2>Sonuç ve Öneri</h2>
        <p>Eğer sesli asistan kullanmak, resim çizdirmek ve internette hızlıca araştırma yapmak istiyorsanız <strong>ChatGPT</strong> sizin için en iyi seçenektir. Ancak işiniz kod yazmaksa, uzun dökümanları analiz edip doğal Türkçe içerikler üretmek istiyorsanız <strong>Claude 3.5 Sonnet</strong> şu anki pazarın en iyisidir.</p>
      `,
      toolIds: [chatgpt?.id, claude?.id].filter(Boolean) as string[],
    },
    {
      slug: "yerel-bilgisayarda-yapay-zeka-modeli-calistirma-ollama-lm-studio",
      title: "Yerel Bilgisayarda Yapay Zeka Modeli Çalıştırma Kılavuzu: Ollama ve LM Studio",
      excerpt: "Buluta bağımlı kalmadan, internetiniz olmasa bile kendi bilgisayarınızda Llama 4 veya DeepSeek çalıştırmak ister misiniz? Ollama ve LM Studio ile adım adım rehber.",
      readTime: 7,
      author: "Muhammet Yakac",
      featured: true,
      metaTitle: "Yerel Yapay Zeka Modeli Nasıl Çalıştırılır? | Ollama & LM Studio",
      metaDescription: "İnternetsiz yerel yapay zeka rehberi. Ollama ve LM Studio kurulumu, Llama, Mistral ve DeepSeek modellerini local GPU'da çalıştırma adımları.",
      contentTr: `
        <h2>Neden Yerel Yapay Zeka?</h2>
        <p>Veri gizliliği, abonelik ücretleri ve internet kesintileri gibi sebeplerle, yapay zeka modellerini yerel (local) bilgisayarımızda çalıştırmak son dönemin en popüler trendlerinden biri haline geldi. Meta'nın Llama modeli veya DeepSeek'in modelleri artık ev kullanıcılarının bilgisayarlarında bile rahatça çalışabiliyor. Bu kılavuzda, bunu yapmanızı sağlayan en popüler iki aracı inceleyeceğiz: <strong>Ollama</strong> ve <strong>LM Studio</strong>.</p>

        <h2>1. Ollama: Terminal Severler İçin Minimal ve Hızlı</h2>
        <p>Ollama, macOS, Linux ve Windows işletim sistemlerinde arka planda çalışan minimal bir LLM sunucusudur. Terminal üzerinden çalıştırılır ve geliştiriciler için API desteği sunar.</p>
        <h3>Ollama Kurulumu ve Kullanımı:</h3>
        <p>Ollama'yı kurmak son derece basittir:</p>
        <pre><code>curl -fsSL https://ollama.com/install.sh | sh
ollama run llama3</code></pre>
        <p>Bu tek satırlık komutla model bilgisayarınıza iner ve terminal üzerinden sohbet etmeye başlayabilirsiniz. Ollama, bilgisayarınızın GPU (ekran kartı) kaynaklarını otomatik olarak algılar ve optimize eder.</p>

        <h2>2. LM Studio: Görsel Arayüz Arayanlar İçin İdeal</h2>
        <p>Eğer terminal kullanmak istemiyor, ChatGPT benzeri temiz bir sohbet penceresi ve model kütüphanesi arıyorsanız LM Studio sizin için biçilmiş kaftandır. LM Studio, Hugging Face üzerinde paylaşılan GGUF formatındaki tüm modelleri tek tıkla indirip çalıştırmanıza olanak tanır.</p>
        
        <h2>Donanım Gereksinimleri Nelerdir?</h2>
        <p>Yerel yapay zeka modellerini çalıştırmak için en önemli donanım parçası ekran kartınızın belleğidir (VRAM). İşte genel bir kılavuz:</p>
        <ul>
          <li><strong>7B / 8B Parametreli Modeller (örn: Llama 8B):</strong> Minimum 8 GB VRAM'e sahip ekran kartları (Nvidia RTX 3060/4060 veya Apple M1/M2/M3 işlemcili bilgisayarlar).</li>
          <li><strong>14B/32B Modeller:</strong> Minimum 16 GB veya 24 GB VRAM.</li>
        </ul>

        <h2>Özet ve Tavsiye</h2>
        <p>Modelleri kendi yazılımlarınıza bağlamak veya arka planda çalışmasını sağlamak istiyorsanız <strong>Ollama</strong>'yı tercih edin. Ancak modelleri indirip doğrudan bir program içerisinden sohbet etmek, parametrelerle oynamak istiyorsanız <strong>LM Studio</strong> kurmanız gereken en iyi yazılımdır.</p>
      `,
      toolIds: [ollama?.id, lmstudio?.id].filter(Boolean) as string[],
    },
  ];

  for (const post of posts) {
    const createdPost = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        contentTr: post.contentTr,
        readTime: post.readTime,
        author: post.author,
        featured: post.featured,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
      },
    });

    console.log(`  BlogPost: ${post.title}`);

    // Create associations to tools
    if (post.toolIds && post.toolIds.length > 0) {
      for (const toolId of post.toolIds) {
        await prisma.blogPostTool.upsert({
          where: {
            blogPostId_toolId: {
              blogPostId: createdPost.id,
              toolId: toolId,
            },
          },
          update: {},
          create: {
            blogPostId: createdPost.id,
            toolId: toolId,
          },
        }).catch(() => {});
      }
    }
  }

  console.log("Blog seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
