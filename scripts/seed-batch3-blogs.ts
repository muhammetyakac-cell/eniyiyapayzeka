import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting batch 3 blogs seeding...");

  // Fetch tools
  const chatgpt = await prisma.aiTool.findUnique({ where: { slug: "chatgpt-nedir" } });
  const surferseo = await prisma.aiTool.findUnique({ where: { slug: "surfer-seo-nedir" } });
  const elevenlabs = await prisma.aiTool.findUnique({ where: { slug: "elevenlabs-nedir" } });
  const runway = await prisma.aiTool.findUnique({ where: { slug: "runway-gen-2-nedir" } });
  const heygen = await prisma.aiTool.findUnique({ where: { slug: "heygen-nedir" } });
  const alphasense = await prisma.aiTool.findUnique({ where: { slug: "alphasense-nedir" } });
  const eightfold = await prisma.aiTool.findUnique({ where: { slug: "eightfold-ai-nedir" } });

  const batch3Posts = [
    {
      slug: "yapay-zeka-ile-icerik-uretimi-chatgpt-surfer-seo",
      title: "Yapay Zeka ile İçerik Üretimi: ChatGPT ve Surfer SEO Birlikte Nasıl Kullanılır?",
      excerpt: "Google sıralamalarını domine etmek için ChatGPT'nin yaratıcılığını ve Surfer SEO'nun analitik gücünü birleştiren nihai içerik üretimi rehberi.",
      readTime: 6,
      author: "Muhammet Yakac",
      featured: false,
      metaTitle: "ChatGPT ve Surfer SEO ile İçerik Üretimi Rehberi | eniyiyapayzeka",
      metaDescription: "Yapay zeka ile SEO uyumlu makale yazımı. ChatGPT'yi Surfer SEO yönergelerine göre yönlendirerek Google'da üst sıralara çıkma teknikleri.",
      contentTr: `
        <h2>Modern İçerik Üretiminin İki Büyük Silahı</h2>
        <p>İçerik pazarlaması dünyasında artık sadece iyi yazmak yetmiyor; Google'ın algoritmalarını tatmin eden teknik optimizasyonları da yapmak gerekiyor. <strong>ChatGPT</strong> mükemmel bir yazar olsa da, teknik SEO kurallarını bilmez. <strong>Surfer SEO</strong> ise teknik kuralları çok iyi bilir ancak içerik yazmaz (Surfer AI eklentisi hariç). Bu ikisini birleştirmek, dijital pazarlamacıların en büyük avantajıdır.</p>
        
        <h2>Adım Adım Entegrasyon ve İş Akışı</h2>
        <ol>
          <li><strong>Surfer SEO'da Kelime Araştırması:</strong> Hedef anahtar kelimenizi Surfer SEO'ya girerek bir Content Editor oluşturun. Surfer size kullanmanız gereken alt başlıkları (H2/H3) ve kelime listesini çıkaracaktır.</li>
          <li><strong>ChatGPT İçin Prompt Hazırlama:</strong> Surfer'ın verdiği kelime listesini ve başlıkları kopyalayarak ChatGPT'ye şu promptu yazın: <em>"Aşağıdaki alt başlıkları ve zorunlu anahtar kelimeleri kullanarak doğal, akıcı ve bilgilendirici bir makale taslağı oluştur."</em></li>
          <li><strong>Skoru Yükseltme:</strong> ChatGPT'nin ürettiği metni Surfer Editor'e yapıştırın. Genellikle skor 50-60 aralığında olacaktır. Eksik kalan anahtar kelimeleri ChatGPT'ye tekrar vererek "Bu kelimeleri eksik bıraktın, makaleye doğal bir şekilde yedir" diyerek skoru 80+ seviyesine taşıyın.</li>
        </ol>

        <h2>Sonuç</h2>
        <p>Bu iş akışı sayesinde, hem kullanıcıyı sıkmayan yaratıcı içerikler üretebilir hem de arama motoru optimizasyonunu kusursuz hale getirerek organik trafik patlaması yaşayabilirsiniz.</p>
      `,
      toolIds: [chatgpt?.id, surferseo?.id].filter(Boolean) as string[],
    },
    {
      slug: "sesli-yapay-zeka-devrimi-elevenlabs-ses-klonlama",
      title: "Sesli Yapay Zeka Devrimi: ElevenLabs ile Kendi Sesinizi Nasıl Klonlarsınız?",
      excerpt: "Sadece 1 dakikalık ses kaydınızla dijital ikizinizi yaratın. ElevenLabs'ın ses klonlama teknolojisi içerik üreticilerini nasıl dönüştürüyor?",
      readTime: 5,
      author: "Muhammet Yakac",
      featured: true,
      metaTitle: "ElevenLabs Ses Klonlama Rehberi | eniyiyapayzeka",
      metaDescription: "ElevenLabs ile kendi sesinizi veya ünlülerin seslerini nasıl klonlarsınız? Yapay zeka ile profesyonel dublaj ve podcast üretimi adımları.",
      contentTr: `
        <h2>Neden Ses Klonlamaya İhtiyacımız Var?</h2>
        <p>YouTube videoları, podcastler, sesli kitaplar... Tüm bu içerikleri üretmek için stüdyo ortamı ve saatlerce mikrofon başında kalmak gerekiyor. Ancak <strong>ElevenLabs</strong> sayesinde, sesinizi sadece bir kez yapay zekaya tanıtarak binlerce kelimelik metni saniyeler içinde kendi sesinizle okutabilirsiniz.</p>
        
        <h2>Adım Adım Ses Klonlama Süreci</h2>
        <ul>
          <li><strong>Temiz Bir Ses Kaydı Alın:</strong> Yankısız bir odada, arka plan müziği olmadan 1 ile 5 dakika arası düzgün diksiyonla okuduğunuz bir ses dosyasını hazırlayın.</li>
          <li><strong>ElevenLabs'a Yükleyin:</strong> VoiceLab bölümünden "Add Voice" ve ardından "Instant Voice Cloning" seçeneğine tıklayın.</li>
          <li><strong>Metninizi Ekleyin:</strong> Model eğitildikten (yaklaşık 10 saniye) sonra, istediğiniz metni yazıp kendi ses modelinizle okunmasını dinleyebilirsiniz.</li>
        </ul>

        <h2>Pazarlama ve Eğitime Etkisi</h2>
        <p>Kendi sesinizi klonlayarak aynı videoyu hem İngilizce hem İspanyolca hem de Almanca dillerinde (kendi ses tonunuzu kaybetmeden) yayınlayabilirsiniz. Bu, globalleşmek isteyen içerik üreticileri için devasa bir fırsattır.</p>
      `,
      toolIds: [elevenlabs?.id].filter(Boolean) as string[],
    },
    {
      slug: "video-duzenlemede-yapay-zeka-runway-heygen",
      title: "Video Düzenlemede Yapay Zeka: Runway Gen-2 ve HeyGen",
      excerpt: "Kameraları, ışıkları ve setleri unutun. Runway ile sıfırdan sinematik görüntüler üretin, HeyGen ile yapay zeka avatarları konuşturun.",
      readTime: 7,
      author: "Muhammet Yakac",
      featured: false,
      metaTitle: "Runway Gen-2 vs HeyGen | Yapay Zeka Video Üretimi",
      metaDescription: "Yapay zeka ile video üretimi. Runway Gen-2 ile metinden film sahneleri yaratmak ve HeyGen ile yapay zeka sunucu avatarları oluşturmak.",
      contentTr: `
        <h2>Kamerasız Film Çekmek Mümkün Mü?</h2>
        <p>Yapay zeka video alanında o kadar hızlı ilerliyor ki, stok video siteleri yerini yavaş yavaş "Text-to-Video" (metinden video) platformlarına bırakıyor. Bu alandaki iki farklı yaklaşımı <strong>Runway Gen-2</strong> ve <strong>HeyGen</strong> temsil ediyor.</p>
        
        <h2>Runway Gen-2: Sinematik B-Roll ve Hayal Gücü</h2>
        <p>Runway, yazdığınız metinlerden 4 saniyelik sinematik sahneler üretir. Özellikle belgesel, bilim kurgu sahneleri, ürün tanıtımları veya soyut arka planlar (B-Roll) için kusursuz çalışır. Motion Brush aracıyla resimdeki sadece belirli bir bölgenin (şelalenin) hareket etmesini sağlayarak yaratıcılığınızı konuşturabilirsiniz.</p>

        <h2>HeyGen: Sözlü Eğitim ve Sunum Videoları</h2>
        <p>HeyGen ise hikaye anlatımından ziyade, "Konuşan Kafalar" (Talking Heads) denilen kurumsal, eğitici ve sunum odaklı videolara odaklanır. İşe alım eğitim videoları, kısa Instagram Reels bilgilendirmeleri veya YouTube haber bültenleri için idealdir. Sizin yerinize kameraya bakıp metni mükemmel dudak senkronizasyonuyla okuyan bir yapay zeka avatarı yaratır.</p>

        <h2>Sonuç</h2>
        <p>Eğer bir hikaye anlatıyor ve görsel sahneler yaratmak istiyorsanız <strong>Runway</strong>, eğitim veriyor veya bir şeyler satmak için kameraya konuşan birine ihtiyaç duyuyorsanız <strong>HeyGen</strong> kullanmalısınız.</p>
      `,
      toolIds: [runway?.id, heygen?.id].filter(Boolean) as string[],
    },
    {
      slug: "finans-sektorunde-yapay-zeka-alphasense",
      title: "Finans Sektöründe Yapay Zeka: AlphaSense ile Pazar Analizi",
      excerpt: "Milyonlarca kazanç çağrısını, borsa raporunu ve finansal haberleri yapay zekaya okutarak yatırım stratejisi belirlemenin yeni yolu.",
      readTime: 5,
      author: "Muhammet Yakac",
      featured: false,
      metaTitle: "AlphaSense Nedir? Yapay Zeka Finans Analizi | eniyiyapayzeka",
      metaDescription: "Finansal araştırma sürelerini %80 kısaltan yapay zeka aracı AlphaSense kullanımı. Bilanço özetleri, duyarlılık analizi ve pazar araştırması.",
      contentTr: `
        <h2>Manuel Rapor Okuma Devri Bitti</h2>
        <p>Bir finansal analistin en çok vakit kaybettiği iş, onlarca sayfalık şirket raporlarını (10-K formları), borsa duyurularını ve kazanç çağrısı dökümlerini (earning calls) okumaktır. <strong>AlphaSense</strong>, bu verileri yapay zeka tabanlı akıllı bir arama motorunda birleştirerek süreci otomatikleştiriyor.</p>
        
        <h2>Duyarlılık Analizi (Sentiment Analysis) Nedir?</h2>
        <p>AlphaSense'in en güçlü özelliklerinden biri, CEO'ların konuşmalarındaki kelime seçimlerini analiz ederek "Gelecek için karamsar mı yoksa iyimser mi?" olduklarını grafiklerle göstermesidir. İnsan gözünün kaçırabileceği ufak tereddüt belirtilerini yapay zeka saniyeler içinde yakalayabilir.</p>

        <h2>Kimler İçin Uygun?</h2>
        <p>Bu teknoloji, bireysel borsa yatırımcılarından ziyade, portföy yöneticileri, yatırım bankacıları ve kurumsal strateji uzmanları için büyük bir rekabet avantajı sağlamaktadır.</p>
      `,
      toolIds: [alphasense?.id].filter(Boolean) as string[],
    },
    {
      slug: "insan-kaynaklarinda-yapay-zeka-eightfold",
      title: "İnsan Kaynaklarında Yapay Zeka: Eightfold AI İle İşe Alım",
      excerpt: "Yüzlerce özgeçmişi saniyeler içinde inceleyen, beceri bazlı eşleştirme yapan yetenek zekası platformu Eightfold AI.",
      readTime: 6,
      author: "Muhammet Yakac",
      featured: false,
      metaTitle: "Eightfold AI İşe Alım Rehberi | İnsan Kaynaklarında Yapay Zeka",
      metaDescription: "Yapay zeka insan kaynakları yazılımları. Eightfold AI ile beceri odaklı (skills-based) aday eşleştirme ve şirket içi yetenek yönetimi.",
      contentTr: `
        <h2>Yetenek Zekası (Talent Intelligence) Nedir?</h2>
        <p>İnsan kaynakları (İK) departmanları, doğru pozisyon için doğru yeteneği bulmakta zorlanıyor. Geleneksel Aday Takip Sistemleri (ATS) sadece anahtar kelime eşleştirirken, <strong>Eightfold AI</strong> yapay zeka kullanarak adayın sadece mevcut yeteneklerini değil, öğrenebileceği ve başarılı olabileceği potansiyel alanları da tahmin eder.</p>
        
        <h2>Önyargısız İşe Alım Mümkün Mü?</h2>
        <p>Eightfold'un en önemli özelliklerinden biri "Maskelenmiş İnceleme" (Masked Review) sunmasıdır. Yapay zeka, adayın ismini, cinsiyetini, yaşını ve fotoğrafını yöneticilerden gizleyerek sadece yeteneklere odaklanmalarını sağlar. Bu sayede şirket içi eşitlik ve çeşitlilik hedeflerine ulaşılır.</p>

        <h2>Şirket İçi Kariyer Planlaması</h2>
        <p>Sadece dışarıdan personel bulmak için değil, mevcut personelin şirket içi başka bir departmana veya projeye kaydırılması (Internal Mobility) konusunda da Eightfold harika analizler sunar. Çalışanın yetenek envanteri sürekli güncellenir ve ona şirket içi terfi fırsatları otomatik olarak önerilir.</p>
      `,
      toolIds: [eightfold?.id].filter(Boolean) as string[],
    }
  ];

  for (const post of batch3Posts) {
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

  console.log("Batch 3 blogs seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
