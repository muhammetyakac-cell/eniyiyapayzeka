import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting additional blogs seeding...");

  // Find tools in database to connect them
  const midjourney = await prisma.aiTool.findUnique({ where: { slug: "midjourney-nedir" } });
  const dalle = await prisma.aiTool.findUnique({ where: { slug: "dall-e-3-nedir" } });

  const deepseek = await prisma.aiTool.findUnique({ where: { slug: "deepseek-nedir" } });
  const chatgpt = await prisma.aiTool.findUnique({ where: { slug: "chatgpt-nedir" } });

  const autogpt = await prisma.aiTool.findUnique({ where: { slug: "autogpt-nedir" } });
  const crewai = await prisma.aiTool.findUnique({ where: { slug: "crewai-nedir" } });

  const gamma = await prisma.aiTool.findUnique({ where: { slug: "gamma-nedir" } });
  const beautifulai = await prisma.aiTool.findUnique({ where: { slug: "beautiful-ai-nedir" } });

  const llamaindex = await prisma.aiTool.findUnique({ where: { slug: "llamaindex-nedir" } });
  const langchain = await prisma.aiTool.findUnique({ where: { slug: "langchain-nedir" } });

  const additionalPosts = [
    {
      slug: "midjourney-ve-dall-e-3-gorsel-uretim-rehberi",
      title: "Yapay Zeka ile Görsel Üretim Rehberi: Midjourney ve DALL-E 3 Teknikleri",
      excerpt: "Metinden görsel üreten yapay zekalar ile hayalinizdeki görselleri gerçeğe dönüştürün. Midjourney v6 ve DALL-E 3 prompt teknikleri.",
      readTime: 7,
      author: "Muhammet Yakac",
      featured: true,
      metaTitle: "Midjourney ve DALL-E 3 Prompt Teknikleri Rehberi | eniyiyapayzeka",
      metaDescription: "Yapay zeka görsel üretimi ipuçları. Midjourney v6 ve DALL-E 3 ile sanatsal, gerçekçi görsel üretmek için en etkili Türkçe ve İngilizce prompt rehberi.",
      contentTr: `
        <h2>Yapay Zeka Sanatında Yeni Dönem</h2>
        <p>Görsel üretim araçları, dijital içerik üreticileri, tasarımcılar ve ajanslar için vazgeçilmez hale geldi. Bu alandaki iki dev, <strong>Midjourney</strong> ve <strong>DALL-E 3</strong>, farklı prompt (komut) yapıları ve estetik çıktıları ile öne çıkıyor. Bu rehberde, her iki araçtan en iyi sonucu nasıl alacağınızı inceleyeceğiz.</p>

        <h2>1. Midjourney: Sanatsal ve Gerçekçi Görsellerin Kralı</h2>
        <p>Midjourney, özellikle v6 sürümü ile fotoğraf kalitesinde ve sanatsal derinliğe sahip görseller üretmekte rakipsizdir. Discord üzerinden kullanılan bu araç, detaylı parametre yapıları sunar.</p>
        <h3>Midjourney Parametreleri ve İpuçları:</h3>
        <ul>
          <li><strong>--ar (Aspect Ratio):</strong> Görsel oranını belirler. Yatay görseller için <code>--ar 16:9</code>, dikey (mobil) için <code>--ar 9:16</code> kullanın.</li>
          <li><strong>--v (Version):</strong> v6 sürümünü aktif etmek için prompt sonuna <code>--v 6</code> ekleyin.</li>
          <li><strong>--stylize:</strong> Yapay zekanın sanatsal özgürlüğünü artırmak için 0 ile 1000 arasında değer verin (örn: <code>--s 750</code>).</li>
        </ul>

        <h2>2. DALL-E 3: Kelimeleri Tam Anlayan Yapay Zeka</h2>
        <p>OpenAI'nin DALL-E 3 modeli, ChatGPT ile entegre çalışır. En büyük avantajı, çok uzun ve karmaşık promptları bile kelimesi kelimesine anlayıp görselleştirebilmesidir. Metin (yazı) içeren görseller üretmekte Midjourney'den daha başarılıdır.</p>
        <h3>DALL-E 3 Prompt İpuçları:</h3>
        <p>Prompt yazarken sahnedeki nesneleri, ışık açısını ve renk paletini detaylıca tarif edin. DALL-E 3, belirsiz komutlar yerine net yönergeleri çok iyi işler.</p>

        <h2>Görsel Karşılaştırma Analizi</h2>
        <table>
          <thead>
            <tr>
              <th>Kriter</th>
              <th>Midjourney</th>
              <th>DALL-E 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fotoğraf Gerçekçiliği</td>
              <td>Mükemmel (Doğal cilt dokusu, ışık)</td>
              <td>Orta (Bazen dijital çizim hissi verir)</td>
            </tr>
            <tr>
              <td>Metin Ekleme Yeteneği</td>
              <td>Orta (Kısa kelimelerde başarılı)</td>
              <td>Çok Başarılı (Tabelalar, logolar yazabilir)</td>
            </tr>
            <tr>
              <td>Kullanım Kolaylığı</td>
              <td>Zor (Discord arayüzü gerektirir)</td>
              <td>Kolay (ChatGPT sohbet penceresi)</td>
            </tr>
          </tbody>
        </table>

        <h2>Sonuç: Hangisi Hangi İş İçin Uygun?</h2>
        <p>Sanatsal bir çalışma, web sitesi arka planı veya gerçekçi bir portre üretiyorsanız tercihiniz kesinlikle <strong>Midjourney</strong> olmalıdır. Ancak bir ürün kutusu tasarımı, üzerinde yazı olan bir poster veya çizgi film tarzı hızlı bir illüstrasyon istiyorsanız <strong>DALL-E 3</strong> işinizi çok daha hızlı görecektir.</p>
      `,
      toolIds: [midjourney?.id, dalle?.id].filter(Boolean) as string[],
    },
    {
      slug: "deepseek-r1-nedir-chatgpt-karsilastirma",
      title: "DeepSeek R1 Nedir? Matematik ve Kodlamada ChatGPT'ye Nasıl Kafa Tutuyor?",
      excerpt: "Çinli yapay zeka şirketi DeepSeek'in yeni akıl yürütme modeli R1, inanılmaz uygun maliyeti ve yüksek başarısı ile dünyayı sarstı. İşte tüm detaylar.",
      readTime: 6,
      author: "Muhammet Yakac",
      featured: true,
      metaTitle: "DeepSeek R1 Nedir, Nasıl Kullanılır? | eniyiyapayzeka",
      metaDescription: "DeepSeek R1 modeli incelemesi. OpenAI o1 ve o3-mini ile karşılaştırmalı matematik, mantık yürütme ve kod yazma performans testleri.",
      contentTr: `
        <h2>Yapay Zekada Akıl Yürütme (Reasoning) Çağı</h2>
        <p>Yapay zeka modelleri artık sadece kelimeleri tahmin etmiyor, cevap vermeden önce "düşünüyor". Çin merkezli <strong>DeepSeek</strong> firmasının geliştirdiği <strong>R1</strong> modeli, açık kaynaklı yapısı ve düşünme zinciri (Chain of Thought) metodu ile yapay zeka dünyasında kartların yeniden dağıtılmasına yol açtı.</p>

        <h2>DeepSeek R1 Neden Bu Kadar Konuşuluyor?</h2>
        <p>DeepSeek R1, OpenAI'nin o1 ve o3-mini modelleri gibi çalışır. Bir soru sorduğunuzda, arka planda alternatif çözüm yollarını değerlendirir, kendi hatalarını düzeltir ve en mantıklı cevaba ulaşmak için içsel bir monolog yürütür. Bu sayede karmaşık matematik, fizik ve kodlama sorularında geleneksel modellere göre çok daha yüksek başarı oranlarına ulaşır.</p>

        <h2>Fiyat ve Maliyet Devrimi</h2>
        <p>DeepSeek'in en büyük başarısı, bu düzeyde bir modeli Amerikan rakiplerine göre neredeyse 10 kat daha ucuza eğitmeyi ve API hizmetini 15 kat daha ucuza sunmayı başarmasıdır. Bu durum, yapay zeka entegrasyonu yapmak isteyen teknoloji şirketleri için devasa bir maliyet avantajı anlamına geliyor.</p>

        <h2>Özellik Karşılaştırması</h2>
        <ul>
          <li><strong>Açık Kaynak:</strong> DeepSeek R1 modelleri açık kaynaktır ve MIT lisansı ile dağıtılır. İsteyen firmalar modeli kendi yerel sunucularında özelleştirebilir.</li>
          <li><strong>Mantık Testleri:</strong> R1, özellikle kodlama olimpiyatlarında ve ileri düzey matematik sorularında GPT-4o modelini geride bırakmaktadır.</li>
        </ul>

        <h2>Sonuç</h2>
        <p>DeepSeek R1, yapay zekanın tekel olamayacağını ve açık kaynaklı modellerin ticari kapalı modellere kafa tutabileceğini kanıtladı. Geliştiriciler ve şirketler için şu anki en iyi maliyet/performans oranına sahip akıl yürütme modelidir.</p>
      `,
      toolIds: [deepseek?.id, chatgpt?.id].filter(Boolean) as string[],
    },
    {
      slug: "otonom-yapay-zeka-ajanlari-autogpt-ve-crewai-rehberi",
      title: "Yazılımcılar İçin Otonom Yapay Zeka Ajanları: AutoGPT ve CrewAI Kullanımı",
      excerpt: "Yapay zekanın sizin yerinize araştırma yapmasını, kod yazmasını ve bir proje yöneticisi gibi çalışmasını ister misiniz? Ajan platformları AutoGPT ve CrewAI.",
      readTime: 8,
      author: "Muhammet Yakac",
      featured: false,
      metaTitle: "AutoGPT ve CrewAI Otonom Ajan Rehberi | eniyiyapayzeka",
      metaDescription: "Çoklu ajan sistemleri nasıl çalışır? AutoGPT ve CrewAI kullanarak otonom pazar araştırması ve otomatik yazılım geliştirme projeleri tasarlama adımları.",
      contentTr: `
        <h2>Yapay Zeka Ajanı (AI Agent) Nedir?</h2>
        <p>Geleneksel yapay zeka araçları sizden aldıkları soruya tek seferlik bir cevap verir. Otonom yapay zeka ajanları ise verdiğiniz hedefi gerçekleştirmek için internette arama yapabilir, dosyalar oluşturabilir, terminalde kod çalıştırabilir ve hedefe ulaşana kadar otonom döngüler yürütebilir. Bu alandaki iki öncü araç <strong>AutoGPT</strong> ve <strong>CrewAI</strong>'dir.</p>

        <h2>1. AutoGPT: Tek Başına Çalışan Otonom Ajan</h2>
        <p>AutoGPT, kendisine verilen ana hedefi (örn: "2026 yılı yapay zeka trendlerini araştırıp PDF rapor oluştur") alt hedeflere böler. Kendi kendine görev listesi çıkarıp internette siteleri tarayarak veri toplar ve dosyayı kaydeder.</p>

        <h2>2. CrewAI: Ajanlar Ordusu Kurmak</h2>
        <p>CrewAI, rol tabanlı çoklu ajan (Multi-Agent) sistemleri kurmanızı sağlar. Bir proje için farklı yapay zeka rollerini tanımlarsınız:</p>
        <ul>
          <li><strong>Ajan 1 (Araştırmacı):</strong> İnternette arama yapıp verileri toplar.</li>
          <li><strong>Ajan 2 (Yazar):</strong> Toplanan verilerden blog yazısı hazırlar.</li>
          <li><strong>Ajan 3 (Editör):</strong> Yazıyı SEO kurallarına ve imlaya göre kontrol eder.</li>
        </ul>
        <p>Bu ajanlar birbirleriyle veri alışverişi yaparak projenizi sıfır insan müdahalesi ile tamamlar.</p>

        <h2>Sonuç ve Kullanım Alanları</h2>
        <p>Özellikle veri kazıma, rakip analizi, otomatik sosyal medya yönetimi ve yazılım geliştirme gibi tekrarlı işler için <strong>CrewAI</strong> şablonları şirketlerin iş yükünü %80'e varan oranda azaltabilmektedir.</p>
      `,
      toolIds: [autogpt?.id, crewai?.id].filter(Boolean) as string[],
    },
    {
      slug: "yapay-zeka-destekli-sunum-hazirlama-gamma-beautifulai",
      title: "Yapay Zeka Destekli Sunum Hazırlama: Gamma ve Beautiful.ai Karşılaştırması",
      excerpt: "Saatlerce PowerPoint şablonları ile uğraşmaya son. Tek prompt ile profesyonel slaytlar hazırlayan yapay zeka araçları Gamma ve Beautiful.ai.",
      readTime: 6,
      author: "Muhammet Yakac",
      featured: false,
      metaTitle: "Gamma vs Beautiful.ai Yapay Zeka Sunum Karşılaştırması | 2026",
      metaDescription: "Yapay zeka slayt ve sunum hazırlama araçları. Gamma ve Beautiful.ai özellikleri, şablon tasarımları ve fiyatlandırma seçenekleri incelemesi.",
      contentTr: `
        <h2>Sunum Hazırlamada AI Kolaylığı</h2>
        <p>İş hayatında ve eğitimde etkileyici sunumlar hazırlamak ciddi zaman alır. Yapay zeka, bu süreci dakikalara indirmektedir. <strong>Gamma</strong> ve <strong>Beautiful.ai</strong>, slayt tasarımlarınızı yapay zeka asistanlığı ile profesyonel seviyeye çeken en popüler iki uygulamadır.</p>

        <h2>1. Gamma: Tek Cümleyle Web Sayfası ve Sunum</h2>
        <p>Gamma, sadece bir prompt yazarak (örn: "Yeni SaaS projemizin yatırımcı sunumu") saniyeler içinde tüm şablonu, görselleri ve yazıları oluşturur. Tasarımları son derece modern, interaktif ve mobil uyumludur.</p>

        <h2>2. Beautiful.ai: Akıllı Şablonlar ve Otomatik Düzen</h2>
        <p>Beautiful.ai, siz metin veya grafik ekledikçe slaytın düzenini otomatik olarak yeniden boyutlandıran akıllı şablonlar sunar. Slayt üzerindeki hiçbir elemanın kayması veya taşması söz konusu olmaz.</p>

        <h2>Sonuç</h2>
        <p>Hızlıca modern, kart tarzı tasarımlar ve içerikler üretmek istiyorsanız <strong>Gamma</strong> en iyi tercihtir. Ancak kurumsal şablonlara sadık kalmak ve veri grafikleriyle çalışmak istiyorsanız <strong>Beautiful.ai</strong> slaytlarınızı otomatik olarak kusursuz hizalayacaktır.</p>
      `,
      toolIds: [gamma?.id, beautifulai?.id].filter(Boolean) as string[],
    },
    {
      slug: "rag-nedir-llamaindex-ve-langchain-karsilastirmasi",
      title: "RAG (Retrieval-Augmented Generation) Nedir? LlamaIndex ve LangChain ile Akıllı Arama",
      excerpt: "Kendi belgeleriniz, PDF'leriniz ve özel şirket verileriniz üzerinde çalışan akıllı yapay zeka asistanları kurun. LlamaIndex ve LangChain RAG karşılaştırması.",
      readTime: 8,
      author: "Muhammet Yakac",
      featured: true,
      metaTitle: "LlamaIndex vs LangChain RAG Karşılaştırması | eniyiyapayzeka",
      metaDescription: "Özel veriyle yapay zeka asistanı geliştirme. RAG sistemlerinde LlamaIndex ve LangChain framework'lerinin farkları ve entegrasyon yöntemleri.",
      contentTr: `
        <h2>RAG (Bilgi Geri Kazanımı ile Güçlendirilmiş Üretim) Nedir?</h2>
        <p>Büyük dil modelleri (LLM) genel internet verileriyle eğitilir ve şirketinizin özel dökümanlarını bilmezler. <strong>RAG (Retrieval-Augmented Generation)</strong>, LLM'e kendi dosyalarınızı (PDF, veri tabanları, şirket içi notlar) güvenli bir şekilde bağlayarak, sadece bu verilere dayanarak cevap vermesini sağlayan bir mimaridir. Bu alandaki en popüler iki kütüphane <strong>LlamaIndex</strong> ve <strong>LangChain</strong>'dir.</p>

        <h2>1. LlamaIndex: Veri Arama ve İndeksleme Odaklı</h2>
        <p>LlamaIndex, doğrudan özel verilerinizi yapay zekaya bağlamak amacıyla optimize edilmiştir. PDF, SQL, Notion veya Slack verilerini kolayca okur, bunları vektör tabanına indeksler ve yapay zekanın hızlıca doğru belgeyi bulmasını sağlar.</p>

        <h2>2. LangChain: Esnek Yapay Zeka Akışları ve Ajanlar</h2>
        <p>LangChain, yapay zekanın sadece veri okumasını değil, farklı araçlarla zincirleme (chaining) halinde çalışmasını sağlar. Örneğin: "Veriyi oku, API'ye gönder, sonucu e-posta at" gibi esnek iş akışları tasarlamanızı sağlar.</p>

        <h2>Hangisini Kullanmalısınız?</h2>
        <p>Eğer amacınız sadece dökümanlarınız üzerinde çalışan, sorulara belgelerden doğru referans vererek cevap veren bir sohbet robotu yapmaksa <strong>LlamaIndex</strong> çok daha hızlı ve yüksek arama başarısı sunar. Ancak yapay zekaya terminal komutları çalıştırmak, harici araçlar kullandırmak ve karmaşık ajan akışları tasarlamak istiyorsanız <strong>LangChain</strong> esnekliği ile öne çıkacaktır.</p>
      `,
      toolIds: [llamaindex?.id, langchain?.id].filter(Boolean) as string[],
    },
  ];

  for (const post of additionalPosts) {
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

  console.log("Additional blogs seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
