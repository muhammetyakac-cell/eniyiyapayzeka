import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting massive tools seeding for empty categories...");

  // Fetch all categories to map them
  const dbCategories = await prisma.category.findMany();
  const categoryMap: Record<string, string> = {};
  for (const cat of dbCategories) {
    categoryMap[cat.slug] = cat.id;
  }

  const massiveTools = [
    // --- VIDEO ---
    {
      name: "Runway Gen-2",
      slug: "runway-gen-2-nedir",
      websiteUrl: "https://runwayml.com",
      pricingModel: "FREEMIUM",
      bestFor: "Video İçerik Üreticileri, Yönetmenler",
      useCases: ["Metinden video üretimi", "Görselden video üretimi", "Video stilizasyonu"],
      categories: ["video-yapay-zeka-araclari"],
      metaTitle: "Runway Gen-2 Nedir, Nasıl Kullanılır? | Metinden Video Üretimi",
      metaDescription: "Runway Gen-2 ile metin ve görsellerden profesyonel videolar üretin. Yapay zeka destekli video düzenleme ve oluşturma özellikleri.",
      descriptionTr: `
        <h2>Runway Gen-2 Nedir?</h2>
        <p>Runway Gen-2, metin veya sabit görselleri alıp yüksek kaliteli, sinematik kısa videolara dönüştüren devrim niteliğinde bir yapay zeka video modelidir. Doğrudan tarayıcı üzerinden çalışan Runway, video kurgu süreçlerini yeniden tanımlamaktadır.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Motion Brush:</strong> Sabit bir görseldeki belirli bir nesneyi fırçayla seçerek sadece o nesnenin (örneğin akan suyun) hareket etmesini sağlama.</li>
          <li><strong>Text-to-Video:</strong> Hiçbir materyal olmadan, sadece "Güneş batan bir sahil" yazarak 4K kalitesinde stok video üretimi.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>RunwayML sitesinde hesap oluşturun.</li>
          <li>Gen-2 aracını seçin.</li>
          <li>Prompt kutusuna istediğiniz sahneyi detaylıca yazın veya referans bir resim yükleyin.</li>
          <li>"Generate" butonuna basarak videonuzun oluşturulmasını bekleyin.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> İnanılmaz gerçekçi kamera hareketleri, sürekli güncellenen model, Motion Brush gibi ince ayar özellikleri.</p>
        <p><strong>Sınırlar:</strong> Ücretsiz krediler çabuk tükenir, uzun metrajlı video üretiminde kare tutarlılığı bazen bozulabilir.</p>
      `
    },
    {
      name: "HeyGen",
      slug: "heygen-nedir",
      websiteUrl: "https://heygen.com",
      pricingModel: "FREEMIUM",
      bestFor: "Pazarlamacılar, Eğitmenler",
      useCases: ["Avatar ile sunum videoları", "Ses ve dudak senkronizasyonu", "Çok dilli video çevirisi"],
      categories: ["video-yapay-zeka-araclari", "pazarlama-yapay-zeka-araclari"],
      metaTitle: "HeyGen Nedir? Yapay Zeka Avatar Video Üreticisi",
      metaDescription: "HeyGen ile kendi yapay zeka avatarınızı oluşturun. Yazılı metinleri doğal insan sesi ve dudak senkronizasyonu ile videoya dönüştürün.",
      descriptionTr: `
        <h2>HeyGen Nedir?</h2>
        <p>HeyGen, kameralara veya mikrofonlara ihtiyaç duymadan, gerçekçi insan avatarları kullanarak stüdyo kalitesinde sözlü videolar oluşturmanızı sağlayan bir AI platformudur. Şirket içi eğitimler, pazarlama videoları ve sosyal medya içerikleri için idealdir.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Özel Avatar Üretimi:</strong> Kendi yüzünüzün 2 dakikalık bir videosunu yükleyerek dijital ikizinizi oluşturabilir, sonrasında sadece metin yazarak kendinizi konuşturabilirsiniz.</li>
          <li><strong>Video Çevirisi:</strong> Mevcut bir videoyu yükleyip, kendi ses tonunuzu ve dudak hareketlerinizi koruyarak 40'tan fazla dile çevirisini tek tıkla yapabilirsiniz.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>HeyGen platformuna üye olun.</li>
          <li>Hazır avatarlardan birini seçin veya kendi avatarınızı oluşturun.</li>
          <li>Konuşma metnini girin ve dili seçin.</li>
          <li>Videoyu render ederek indirin.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Çok doğal dudak senkronizasyonu, kendi sesinizi klonlama yeteneği, hızlı video üretimi.</p>
        <p><strong>Sınırlar:</strong> Ücretli planları pahalıdır, hareketli arka plan entegrasyonu kısıtlıdır.</p>
      `
    },
    // --- SES VE MUZIK ---
    {
      name: "ElevenLabs",
      slug: "elevenlabs-nedir",
      websiteUrl: "https://elevenlabs.io",
      pricingModel: "FREEMIUM",
      bestFor: "İçerik Üreticileri, Seslendirmenler",
      useCases: ["Metin seslendirme (TTS)", "Ses klonlama", "Video dublajı"],
      categories: ["ses-muzik-yapay-zeka-araclari"],
      metaTitle: "ElevenLabs Nedir? Dünyanın En Gerçekçi AI Ses Sentezleyicisi",
      metaDescription: "ElevenLabs ile metinleri insan doğallığında seslendirin. Kendi sesinizi klonlayın ve 29+ dilde içerik üretin.",
      descriptionTr: `
        <h2>ElevenLabs Nedir?</h2>
        <p>ElevenLabs, piyasadaki en doğal ve duygulu sesleri üretebilen metinden sese (Text-to-Speech) yapay zeka platformudur. Robotik seslerin aksine, ElevenLabs nefes alışverişlerini, tonlamaları ve duyguları mükemmel taklit eder.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Ses Klonlama (Voice Cloning):</strong> Sadece 1 dakikalık temiz bir ses kaydınızı yükleyerek kendi ses modelinizi eğitebilir ve yazacağınız her metni kendi sesinizle okutabilirsiniz.</li>
          <li><strong>Duygu Kontrolü:</strong> Prompt içine "(kısık sesle)" veya "(heyecanlı)" gibi yönergeler ekleyerek yapay zekanın okuma tarzını yönlendirebilirsiniz.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>ElevenLabs'a giriş yapın.</li>
          <li>Speech Synthesis bölümüne geçin.</li>
          <li>Geniş kütüphaneden bir ses (Voice) seçin. Türkçe destekli bir model (örn: Multilingual v2) seçtiğinizden emin olun.</li>
          <li>Metninizi girip "Generate" butonuna tıklayın.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Benzersiz doğallık, hızlı klonlama, harika çoklu dil desteği.</p>
        <p><strong>Sınırlar:</strong> Ücretsiz planda ticari kullanım izni yoktur, çok uzun metinlerde nadiren telaffuz kaymaları olabilir.</p>
      `
    },
    {
      name: "Suno AI",
      slug: "suno-ai-nedir",
      websiteUrl: "https://suno.com",
      pricingModel: "FREEMIUM",
      bestFor: "Müzik Severler, Sosyal Medya Yöneticileri",
      useCases: ["Metinden şarkı üretme", "Reklam müziği besteleme", "Söz yazarlığı"],
      categories: ["ses-muzik-yapay-zeka-araclari"],
      metaTitle: "Suno AI Nedir? Yapay Zeka ile Kendi Şarkınızı Yapın",
      metaDescription: "Suno AI kullanarak yazdığınız sözlerden saniyeler içinde vokal ve enstrüman içeren tam profesyonel şarkılar oluşturun.",
      descriptionTr: `
        <h2>Suno AI Nedir?</h2>
        <p>Suno AI, sadece birkaç kelimelik tarifler veya yazdığınız şiirlerle saniyeler içinde vokali, ritmi ve melodisi olan tam bir şarkı üreten yapay zeka platformudur.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Özel Söz Yazımı (Custom Mode):</strong> ChatGPT gibi araçlara şarkı sözü yazdırıp Suno'ya yapıştırabilir ve tarz olarak "Anatolian Rock, bağlama, elektro gitar" belirterek Türkçe şarkılar üretebilirsiniz.</li>
          <li><strong>Enstrümantal Üretim:</strong> Sözsüz, sadece fon müziği veya oyun müziği olarak kullanılabilecek epik orkestra müzikleri tasarlayabilirsiniz.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>Suno web sitesine girin ve kayıt olun.</li>
          <li>"Create" butonuna basın.</li>
          <li>İster sadece şarkının konusunu yazın (örn: "Kod yazarken çekilen çileler hakkında bir rap"), isterseniz Custom moda geçip sözleri kendiniz girin.</li>
          <li>Üretilen 2 farklı versiyonu dinleyip favorinizi indirin.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Akıl almaz bir hız ve müzikal kalite, vokallerin doğallığı, geniş tür desteği.</p>
        <p><strong>Sınırlar:</strong> Bazen ses kalitesinde (bitrate) dijital bozulmalar olabilir, parçayı tam istenilen noktadan kesip biçmek zordur.</p>
      `
    },
    // --- 3D VE ANIMASYON ---
    {
      name: "Luma AI",
      slug: "luma-ai-nedir",
      websiteUrl: "https://lumalabs.ai",
      pricingModel: "FREEMIUM",
      bestFor: "3D Tasarımcılar, Oyun Geliştiriciler",
      useCases: ["Videodan 3D model üretimi", "NeRF teknolojisi ile tarama", "Dream Machine ile video üretimi"],
      categories: ["3d-animasyon-yapay-zeka-araclari"],
      metaTitle: "Luma AI Nedir? Videodan 3D Modele",
      metaDescription: "Luma AI ve NeRF teknolojisi ile cep telefonu videolarınızı yüksek kaliteli 3D modellere dönüştürün.",
      descriptionTr: `
        <h2>Luma AI Nedir?</h2>
        <p>Luma AI, sinirsel ışınım alanları (NeRF) teknolojisini kullanarak standart bir akıllı telefonla çekilmiş videoları fotogerçekçi 3D ortamlara ve modellere dönüştüren platformdur. Ayrıca yeni çıkardıkları <strong>Dream Machine</strong> modeli ile metinden video üretiminde de oldukça güçlüdür.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>3D Ürün Tarama:</strong> Bir ayakkabının etrafında yürüyerek 1 dakikalık video çekin, Luma bunu Unreal Engine veya Blender'a aktarılabilir bir 3D modele (GLTF/OBJ) çevirsin.</li>
          <li><strong>Emlak ve Mekan Tarama:</strong> Bir odanın videosunu çekerek odanın tam bir 3D interaktif kopyasını web sitenize yerleştirin.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>Luma iOS uygulamasını indirin veya web sitesini açın.</li>
          <li>Nesnenin etrafında kamerayı yavaşça döndürerek videoyu kaydedin.</li>
          <li>Videoyu Luma'nın bulut sistemine yükleyin.</li>
          <li>15-20 dakika içinde oluşturulan 3D modeli cihazınıza indirin.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> LiDAR sensörüne ihtiyaç duymaması, fotogerçekçi ışıklandırmayı koruması.</p>
        <p><strong>Sınırlar:</strong> Cam ve saydam nesneleri tararken hatalar oluşabilir.</p>
      `
    },
    // --- EGITIM ---
    {
      name: "Quizgecko",
      slug: "quizgecko-nedir",
      websiteUrl: "https://quizgecko.com",
      pricingModel: "FREEMIUM",
      bestFor: "Eğitmenler, Öğretmenler",
      useCases: ["Metinden otomatik test hazırlama", "Sınav soruları üretme", "Eğitim materyali değerlendirme"],
      categories: ["egitim-yapay-zeka-araclari"],
      metaTitle: "Quizgecko Nedir? Yapay Zeka Test Hazırlayıcı",
      metaDescription: "Quizgecko ile herhangi bir metin, PDF veya web sayfasından saniyeler içinde çoktan seçmeli, doğru/yanlış testleri oluşturun.",
      descriptionTr: `
        <h2>Quizgecko Nedir?</h2>
        <p>Quizgecko, girdiğiniz bir metinden, yüklediğiniz PDF belgelerinden veya YouTube videolarından otomatik olarak sorular, testler ve bilgi kartları (flashcards) üreten eğitsel yapay zeka aracıdır.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Ders Materyali Dönüşümü:</strong> 50 sayfalık bir ders PDF'ini sisteme yükleyip, öğrencilere yönelik 30 soruluk bir final sınavını cevap anahtarıyla birlikte dışa aktarabilirsiniz.</li>
          <li><strong>Web ve Chrome Eklentisi:</strong> Öğrenciler okudukları bir Wikipedia makalesi üzerindeyken eklentiyi çalıştırıp anında kendilerini test edebilirler.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>Siteye giriş yapın ve bir döküman veya metin yükleyin.</li>
          <li>Soru tipini (Çoktan seçmeli, klasik, boşluk doldurma) ve zorluk seviyesini seçin.</li>
          <li>Oluşturulan sınavı kontrol edip düzenleyin.</li>
          <li>Sınavı PDF veya LMS (Moodle, Canvas) formatında dışa aktarın.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Zaman tasarrufu, farklı soru tipleri, Türkçe metinleri çok iyi analiz etmesi.</p>
        <p><strong>Sınırlar:</strong> Karmaşık matematiksel grafiklerden veya resimlerden soru üretme yeteneği kısıtlıdır.</p>
      `
    },
    // --- HUKUK ---
    {
      name: "Casetext (CoCounsel)",
      slug: "casetext-nedir",
      websiteUrl: "https://casetext.com",
      pricingModel: "PAID",
      bestFor: "Avukatlar, Hukuk Büroları",
      useCases: ["Dava dosyası okuma ve özetleme", "Hukuki araştırma asistanlığı", "Sözleşme analizi"],
      categories: ["hukuk-yapay-zeka-araclari"],
      metaTitle: "Casetext CoCounsel Nedir? Yapay Zeka Hukuk Asistanı",
      metaDescription: "Casetext ve CoCounsel yapay zekası ile binlerce sayfalık dava dosyalarını dakikalar içinde inceleyin ve özetleyin.",
      descriptionTr: `
        <h2>Casetext ve CoCounsel Nedir?</h2>
        <p>Casetext tarafından geliştirilen CoCounsel, OpenAI'nin GPT-4 modelini kullanan ve hukuk profesyonelleri için özel olarak tasarlanmış ilk güvenilir AI hukuk asistanıdır. Gizliliğe en üst düzeyde önem veren platform, sisteme yüklenen dosyaları başka modelleri eğitmek için kullanmaz.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Döküman İncelemesi:</strong> 10.000 sayfalık dava tutanaklarını yükleyip "Davacının sigorta talebini reddeden paragrafları bul ve listele" diyerek haftalarca sürecek işi dakikalara indirebilirsiniz.</li>
          <li><strong>Hukuki Araştırma (Legal Research):</strong> Belirli bir içtihadı veya emsal davayı bulmak için günlük dilde sorunuzu sorabilirsiniz. Sistem sadece gerçek yasal kaynaklara atıfta bulunur, uydurma bilgi (hallucination) riski minimumdur.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>CoCounsel platformuna hukukçu kimliğinizle kayıt olun.</li>
          <li>Çalışacağınız dosyaları (PDF, Word) sisteme güvenli şekilde yükleyin.</li>
          <li>Görevinizi seçin: Sözleşme inceleme, özet çıkarma veya yasal araştırma.</li>
          <li>Üretilen analizleri dipnotları ve referanslarıyla birlikte inceleyin.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Güvenilirlik, veri gizliliği (Enterprise Grade), GPT-4 gücü.</p>
        <p><strong>Sınırlar:</strong> Amerikan hukuk sistemi (Common Law) odaklı veri tabanı Türkiye için sınırlı olabilir, maliyeti bireysel kullanıcılar için çok yüksektir.</p>
      `
    },
    // --- SAGLIK ---
    {
      name: "Glass Health",
      slug: "glass-health-nedir",
      websiteUrl: "https://glass.health",
      pricingModel: "FREEMIUM",
      bestFor: "Doktorlar, Tıp Öğrencileri",
      useCases: ["Ayırıcı tanı oluşturma", "Klinik vaka özetleme", "Tedavi planı taslaklama"],
      categories: ["saglik-yapay-zeka-araclari"],
      metaTitle: "Glass Health AI Nedir? Hekimler İçin Klinik Yapay Zeka",
      metaDescription: "Glass Health AI ile klinik notlar oluşturun, semptomlara dayalı ayırıcı tanı listeleri hazırlayın. Tıp profesyonelleri için.",
      descriptionTr: `
        <h2>Glass Health Nedir?</h2>
        <p>Glass Health, hekimler ve tıp öğrencileri için tasarlanmış, klinik not tutma ve yapay zeka destekli tıbbi analiz platformudur. Doktorlar, hastanın semptomlarını ve laboratuvar sonuçlarını sisteme girerek yapay zekadan ayırıcı tanı önerileri alabilirler.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Ayırıcı Tanı (Differential Diagnosis):</strong> "45 yaşında erkek, göğüs ağrısı, D-dimer yüksekliği" gibi verileri girerek olası tanıların listesini ve klinik plan taslağını oluşturmasını sağlayabilirsiniz.</li>
          <li><strong>Klinik Eğitim:</strong> Tıp öğrencileri zorlu vakaları sisteme girip yapay zekanın adımları nasıl analiz ettiğini inceleyebilir.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>Glass Health web uygulamasına üye olun.</li>
          <li>Yeni bir hasta notu oluşturun.</li>
          <li>Hastanın şikayetini (HPI) ve bulgularını girin.</li>
          <li>"AI Draft" butonuna basarak klinik plan önerisini görüntüleyin ve kendi tıbbi bilginizle düzenleyin.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Tıbbi terimlere tam hakimiyet, klinik iş akışını hızlandırma, tıbbi not standartlarına uyum.</p>
        <p><strong>Sınırlar:</strong> Yapay zeka bir doktor değildir, son karar her zaman hekime aittir. Sistem ABD kılavuzlarını temel alabilir.</p>
      `
    },
    // --- MUSTERI HIZMETLERI ---
    {
      name: "Chatbase",
      slug: "chatbase-nedir",
      websiteUrl: "https://chatbase.co",
      pricingModel: "PAID",
      bestFor: "Şirketler, Web Sitesi Sahipleri",
      useCases: ["Kendi verinizle chatbot yapma", "Müşteri destek otomasyonu", "Lead toplama"],
      categories: ["musteri-hizmetleri-yapay-zeka-araclari"],
      metaTitle: "Chatbase Nedir? Özel Veriyle Chatbot Kurulumu",
      metaDescription: "Web sitenizin linkini vererek veya PDF yükleyerek dakikalar içinde şirketinizin her şeyini bilen bir müşteri destek botu yaratın.",
      descriptionTr: `
        <h2>Chatbase Nedir?</h2>
        <p>Chatbase, kod yazmanıza gerek kalmadan kendi verilerinizle eğitilmiş bir ChatGPT benzeri yapay zeka chatbot'u oluşturmanızı sağlayan platformdur. Yüklediğiniz PDF'ler, Word dosyaları veya direkt web sitenizin bağlantısı ile kendi şirket botunuzu eğitebilirsiniz.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Web Sitesi Tarama:</strong> Sistem, web sitenizin tüm alt sayfalarını okur. Bir müşteri kargo politikasını sorduğunda, bot doğrudan sizin "İade ve Kargo" sayfanızdaki bilgiyi okuyarak yanıtlar.</li>
          <li><strong>Lead Generation:</strong> Bot, kullanıcılarla sohbet ederken e-posta adreslerini ve isimlerini isteyebilir, bu verileri doğrudan CRM sisteminize (HubSpot, Zapier vb.) aktarabilir.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>Chatbase.co'da hesap oluşturun.</li>
          <li>Veri kaynağı (Data Source) olarak web sitenizin URL'sini girin ve "Fetch" yapın.</li>
          <li>Botun rengini, karşılama mesajını ve karakterini ("Her zaman kibar ol, bilmediğinde destek ekibine yönlendir" gibi) ayarlayın.</li>
          <li>Size verilen embed iframe kodunu web sitenizin (WordPress, Shopify) &lt;head&gt; veya &lt;body&gt; kısmına yapıştırın.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Sıfır kodlama gerektirir, Türkçe dilini mükemmel anlar ve cevaplar, kurulumu 5 dakika sürer.</p>
        <p><strong>Sınırlar:</strong> Yoğun trafikli sitelerde mesaj başına maliyetler artabilir, model kendi kendine öğrenmez (verilerin manuel güncellenmesi gerekir).</p>
      `
    },
    // --- FINANS ---
    {
      name: "AlphaSense",
      slug: "alphasense-nedir",
      websiteUrl: "https://alpha-sense.com",
      pricingModel: "PAID",
      bestFor: "Yatırımcılar, Finansal Analistler",
      useCases: ["Bilanço okuma ve özetleme", "Borsa araştırması", "Haber ve duygu analizi"],
      categories: ["finans-yapay-zeka-araclari"],
      metaTitle: "AlphaSense Nedir? Finansal İstihbarat ve Yapay Zeka",
      metaDescription: "AlphaSense finans arama motoru ile on binlerce kazanç raporu, şirket bildirimi ve haber içinde saniyeler içinde araştırma yapın.",
      descriptionTr: `
        <h2>AlphaSense Nedir?</h2>
        <p>AlphaSense, finans dünyası için tasarlanmış lider bir pazar istihbaratı ve arama motorudur. Milyonlarca kazanç çağrısı (earning calls), broker raporu, yasal dosyalama (SEC) ve sektörel haber içerisinde akıllı semantik arama yaparak finansal analistlerin günlerini alan analizleri saniyelere indirir.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Akıllı Özetleme (Smart Summaries):</strong> Bir şirketin 100 sayfalık yıllık mali raporundaki olumlu ve olumsuz risk faktörlerini tek tıklamayla listeletebilirsiniz.</li>
          <li><strong>Duyarlılık Analizi (Sentiment Analysis):</strong> CEO'ların kazanç çağrılarındaki ses tonu ve kelime seçimlerinden yola çıkarak geleceğe yönelik karamsar veya iyimser olduklarını analiz edebilirsiniz.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>Kurumsal lisans ile platforma giriş yapın.</li>
          <li>Arama çubuğuna araştırdığınız şirketi veya finansal trendi (örn: "Elektrikli araç batarya maliyetleri 2026") yazın.</li>
          <li>Haberleri, raporları ve analizleri tek ekranda filtreleyin.</li>
          <li>AI Asistanına veriler ışığında bir yatırımcı özeti yazdırmasını isteyin.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Devasa ve güvenilir finansal veri tabanı, Wall Street analist raporlarına doğrudan erişim.</p>
        <p><strong>Sınırlar:</strong> Kurumsal şirketlere yönelik olduğu için abonelik ücretleri on binlerce doları bulabilir, bireysel yatırımcılara uygun değildir.</p>
      `
    },
    // --- INSAN KAYNAKLARI ---
    {
      name: "Eightfold AI",
      slug: "eightfold-ai-nedir",
      websiteUrl: "https://eightfold.ai",
      pricingModel: "PAID",
      bestFor: "İK Yöneticileri, İşe Alım Uzmanları",
      useCases: ["Aday eşleştirme", "Özgeçmiş tarama", "Yetenek haritalandırma"],
      categories: ["insan-kaynaklari-yapay-zeka-araclari"],
      metaTitle: "Eightfold AI Nedir? Yapay Zeka İnsan Kaynakları",
      metaDescription: "Eightfold AI ile işe alım sürecini otomatikleştirin. Binlerce özgeçmişi tarayıp en yetenekli adayları şirketinize saniyeler içinde kazandırın.",
      descriptionTr: `
        <h2>Eightfold AI Nedir?</h2>
        <p>Eightfold AI, yapay zeka gücüyle insan kaynakları süreçlerini (işe alım, elde tutma, çeşitlilik) yöneten bir "Yetenek Zekası Platformu"dur. Açık bir iş pozisyonu için başvuran binlerce özgeçmişi (CV) okuyup analiz ederek, en uygun adayı saniyeler içinde karşınıza çıkarır.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Becerilere Dayalı Eşleştirme:</strong> Eski usul "etiket" eşleştirmesi yerine, adayın geçmişte yaptığı projelerden hangi "becerilere" sahip olabileceğini (potansiyelini) tahmin ederek eşleştirme yapar.</li>
          <li><strong>Şirket İçi Mobilite:</strong> Mevcut çalışanlarınızın yeteneklerini analiz ederek, açık olan başka departmanlara terfi veya geçiş için en uygun olanları İK'ya önerir.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>Kurumsal entegrasyonu tamamlayın ve şirketin ATS (Aday Takip Sistemi) verilerini platforma bağlayın.</li>
          <li>Yeni bir iş ilanı profili açın ve aranılan özellikleri belirtin.</li>
          <li>Yapay zekanın aday havuzunuzdaki eski ve yeni başvuruları tarayarak size sunduğu "Sıralı Aday Listesini" inceleyin.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Önyargıyı (cinsiyet/yaş) azaltan maskeleme yeteneği, mevcut veritabanındaki "ölü adayları" yeniden keşfetme.</p>
        <p><strong>Sınırlar:</strong> Kurumsal kurulum gerektirir, küçük işletmeler için maliyetlidir.</p>
      `
    },
    // --- SATIS ---
    {
      name: "Gong",
      slug: "gong-nedir",
      websiteUrl: "https://gong.io",
      pricingModel: "PAID",
      bestFor: "Satış Ekipleri, Müşteri Temsilcileri",
      useCases: ["Satış görüşmesi kaydı ve analizi", "İtiraz karşılama takibi", "Satış koçluğu"],
      categories: ["satis-yapay-zeka-araclari"],
      metaTitle: "Gong.io Nedir? Satış İstihbaratı ve Analizi",
      metaDescription: "Gong ile müşteri görüşmelerinizi yapay zekaya analiz ettirin. Hangi kelimelerin satışı artırdığını öğrenin ve ekibinizi koçluklayın.",
      descriptionTr: `
        <h2>Gong Nedir?</h2>
        <p>Gong, müşteri temas noktalarını (telefon görüşmeleri, Zoom toplantıları, e-postalar) analiz eden lider Gelir Zekası (Revenue Intelligence) platformudur. Satış temsilcilerinizin müşteriyle yaptığı konuşmaları dinler, yazıya döker ve "satışı kapatma ihtimalini" artıran verileri analiz eder.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Gerçek Zamanlı İtiraz Analizi:</strong> Müşteri "Rakipleriniz x özelliğini ücretsiz veriyor" dediğinde, sistem satış temsilcisinin bu itirazı nasıl yönettiğini analiz eder.</li>
          <li><strong>Kazandıran Senaryolar:</strong> Satışı başarıyla kapatan temsilcilerin en çok hangi kelimeleri kullandığını, ne kadar süre dinleyip ne kadar süre konuştuğunu tespit ederek tüm ekibe "İdeal Satış Formülü" sunar.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>Gong sistemini CRM'inize (örn: Salesforce) ve iletişim kanallarınıza (Zoom, Google Meet) entegre edin.</li>
          <li>Yapay zeka toplantılara sessiz bir bot olarak katılıp tüm konuşmaları kaydeder ve deşifre eder.</li>
          <li>Toplantı bitiminde yöneticiler, "Gong Analiz Paneli"nden konuşmanın eyleme geçirilebilir özetlerini (Action Items) inceler.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Manuel not alma derdini bitirir, satış kapanış oranlarını inanılmaz derecede artırır.</p>
        <p><strong>Sınırlar:</strong> Çalışanlar sürekli dinlendiklerini hissedebilir (gizlilik kültürü yönetimi gerektirir), yüksek maliyetlidir.</p>
      `
    },
    // --- OYUN GELISTIRME ---
    {
      name: "Scenario",
      slug: "scenario-nedir",
      websiteUrl: "https://scenario.com",
      pricingModel: "FREEMIUM",
      bestFor: "Oyun Geliştiriciler, Konsept Sanatçılar",
      useCases: ["Oyun varlıkları (asset) üretimi", "Kendi sanat stilini klonlama", "Karakter konsept tasarımı"],
      categories: ["oyun-gelistirme-yapay-zeka-araclari", "gorsel-yapay-zeka-araclari"],
      metaTitle: "Scenario Yapay Zeka Nedir? Oyun Varlığı (Asset) Üretici",
      metaDescription: "Oyun geliştiricileri için tasarlanmış Scenario AI. Kendi sanat stilinizi eğitin ve binlerce tutarlı oyun nesnesi üretin.",
      descriptionTr: `
        <h2>Scenario Nedir?</h2>
        <p>Scenario, oyun stüdyoları ve bağımsız (indie) geliştiriciler için özel olarak geliştirilmiş yapay zeka oyun varlığı (asset) üretim platformudur. Standart görsel araçlarının aksine, oyununuzun görsel kimliğine tam olarak sadık kalacak modeller eğitmenizi sağlar.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Özel Stil Eğitimi:</strong> Oyununuz için elle çizilmiş 10 adet kılıç veya iksir görselini Scenario'ya yükleyerek yapay zekayı bu tarzda eğitirsiniz. Ardından "Mavi renkli bir buz kılıcı" yazdığınızda tamamen sizin oyununuzun stilinde bir çıktı alırsınız.</li>
          <li><strong>İzometrik Nesneler:</strong> Strateji oyunları için 3 boyutlu algısı yaratan izometrik binalar, ağaçlar veya harita zeminlerini saniyeler içinde üretebilirsiniz.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>Scenario web platformuna giriş yapın.</li>
          <li>Kendi karakter veya eşya görsellerinizi yükleyerek yeni bir "Generator" modeli oluşturun.</li>
          <li>Modelin eğitiminin tamamlanmasını bekleyin (genellikle 20-30 dakika).</li>
          <li>Eğitilmiş modelinizi seçerek yeni promptlar yazın ve oyununuzla uyumlu yüzlerce varyasyonu anında indirin.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Oyun bütünlüğünü bozmayan (style-consistent) sonuçlar, Unity vb. motorlara entegrasyon için API desteği.</p>
        <p><strong>Sınırlar:</strong> Kaliteli bir model eğitmek için elinizde yeterli miktarda baz çizim (dataset) olması gereklidir.</p>
      `
    },
    // --- E-TICARET ---
    {
      name: "Octane AI",
      slug: "octane-ai-nedir",
      websiteUrl: "https://octaneai.com",
      pricingModel: "PAID",
      bestFor: "E-Ticaret Mağazaları, Shopify Sahipleri",
      useCases: ["Ürün tavsiye quizleri", "Müşteri asistanlığı", "Dönüşüm oranı artırma"],
      categories: ["e-ticaret-yapay-zeka-araclari", "pazarlama-yapay-zeka-araclari"],
      metaTitle: "Octane AI Nedir? E-Ticaret Quiz ve Kişiselleştirme",
      metaDescription: "Shopify mağazanız için Octane AI ile kişiselleştirilmiş quizler ve testler hazırlayın, müşteriye özel ürün tavsiyeleri yapın.",
      descriptionTr: `
        <h2>Octane AI Nedir?</h2>
        <p>Octane AI, e-ticaret siteleri (özellikle Shopify mağazaları) için "Kişiselleştirilmiş Alışveriş Quizleri" ve yapay zeka tavsiye sistemleri kuran bir platformdur. Amacı, fiziki bir mağazadaki tezgahtarın müşteriye sorular sorarak doğru ürünü bulmasına yardımcı olma deneyimini web sitenize getirmektir.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Dinamik Ürün Sınavları:</strong> Kullanıcıya "Cilt tipiniz nasıl?", "Sivilce sorununuz var mı?" gibi sorular soran interaktif quizler oluşturur. Yapay zeka, yanıtlara dayanarak kataloğunuzdaki en uygun cilt bakım ürünlerini eşleştirir.</li>
          <li><strong>Sıfır Taraf Verisi (Zero-Party Data):</strong> Müşterilerin quizlerde verdiği yanıtları (cilt tipi, bütçe, sevdiği renkler vb.) saklayarak, onlara daha sonra atacağınız e-posta pazarlama kampanyalarını tamamen kişiselleştirilmiş şekilde yapmanızı sağlar.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>Octane AI uygulamasını Shopify mağazanıza kurun.</li>
          <li>Sürükle-bırak arayüzü ile ilk ürün öneri anketinizi tasarlayın.</li>
          <li>Anketin sonuçlarına hangi ürünlerin tavsiye edileceğine dair kuralları belirleyin.</li>
          <li>Quizi ana sayfanızda yayınlayarak müşteri dönüşümlerinin artışını takip edin.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Sepete ekleme oranlarında ve müşteri bağlılığında devasa artış, reklam stratejileri için değerli veri toplama.</p>
        <p><strong>Sınırlar:</strong> Büyük kataloglara sahip mağazalarda tüm ürünleri quiz yapısına entegre etmek başlangıçta zaman alabilir.</p>
      `
    },
    // --- CEVIRI ---
    {
      name: "DeepL",
      slug: "deepl-nedir",
      websiteUrl: "https://deepl.com",
      pricingModel: "FREEMIUM",
      bestFor: "Çevirmenler, Global Ekipler, Öğrenciler",
      useCases: ["Döküman çevirisi", "Akademik makale tercümesi", "E-posta yazımı"],
      categories: ["ceviri-yapay-zeka-araclari"],
      metaTitle: "DeepL Nedir? Dünyanın En Doğru Yapay Zeka Çeviri Aracı",
      metaDescription: "DeepL çeviri programı ile metinlerinizi, PDF ve Word belgelerinizi Google Translate'den çok daha doğal ve bağlama uygun şekilde çevirin.",
      descriptionTr: `
        <h2>DeepL Nedir?</h2>
        <p>DeepL, yapay sinir ağları mimarisini kullanan ve birçok bağımsız teste göre dünyanın en doğru, en akıcı çevirilerini yapan makine çeviri platformudur. Google Translate gibi araçlardan farklı olarak, DeepL cümlenin tamamının bağlamını analiz ederek deyimleri, deyimsel ifadeleri ve sektörel jargonu son derece doğal bir şekilde çevirir.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Tam Belge Çevirisi:</strong> Mizanpajı, resimleri ve formatı bozulmadan Word, PowerPoint veya PDF dosyalarınızı tek tıkla çevirebilirsiniz.</li>
          <li><strong>Alternatif Kelime Önerileri (DeepL Write):</strong> Metni çevirdikten sonra kelimelerin üzerine tıklayarak alternatif eşanlamlı kelimeleri görebilir, resmi dili gayri resmi dile (veya tam tersine) tek tuşla dönüştürebilirsiniz.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>deepl.com adresine gidin veya masaüstü uygulamasını indirin.</li>
          <li>Metni sol kutuya yapıştırın veya belgenizi yükleyin.</li>
          <li>Sağ taraftaki çeviriyi anında kopyalayın. Alternatif cümle yapıları için metnin üzerine tıklayın.</li>
          <li>Düzenli kullanıyorsanız Chrome eklentisini kurarak internetteki yazıları sayfa üzerinde canlı olarak çevirin.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> Benzersiz çeviri doğallığı, veri gizliliğine saygı (DeepL Pro'da verileriniz model eğitimi için kaydedilmez).</p>
        <p><strong>Sınırlar:</strong> Desteklediği dil sayısı Google Translate'e kıyasla daha azdır, ancak Türkçe desteği mevcuttur ve mükemmel çalışır.</p>
      `
    },
    // --- SEO ---
    {
      name: "Surfer SEO",
      slug: "surfer-seo-nedir",
      websiteUrl: "https://surferseo.com",
      pricingModel: "PAID",
      bestFor: "İçerik Editörleri, SEO Uzmanları",
      useCases: ["İçerik optimizasyonu", "Rakip anahtar kelime analizi", "Blog taslağı çıkarma"],
      categories: ["seo-yapay-zeka-araclari"],
      metaTitle: "Surfer SEO Nedir? İçerik Optimizasyonu Aracı",
      metaDescription: "Surfer SEO ile Google'da ilk sayfaya çıkacak içerikler yazın. Yapay zeka ile NLP destekli kelime yoğunluğu ve makale analizi.",
      descriptionTr: `
        <h2>Surfer SEO Nedir?</h2>
        <p>Surfer SEO, arama motorlarında üst sıralara çıkmak için gereken kelimeleri, kelime yoğunluklarını ve makale uzunluğunu yapay zeka ile hesaplayan gelişmiş bir içerik optimizasyon aracıdır. Rakiplerinizin sayfalarını tarar ve Google'ın (NLP algoritmalarının) tam olarak ne görmek istediğini size bir skor tablosu halinde sunar.</p>
        <h2>Gelişmiş Kullanım Modellemesi ve İş Akışları</h2>
        <ul>
          <li><strong>Content Editor (İçerik Editörü):</strong> Yazınızı bu editörde yazarken sağ panelde kullanmanız gereken anahtar kelimeler yeşile döner. 0'dan 100'e kadar olan SEO skorunuzu 80'in üzerine çıkararak Google'da ilk sayfa garantisine yaklaşabilirsiniz.</li>
          <li><strong>Surfer AI:</strong> Sadece hedef kelimenizi verin, Surfer tüm rakip analizini yapsın ve rekabette öne geçecek kusursuz optimize edilmiş 2000 kelimelik makaleyi saniyeler içinde sizin için yazsın.</li>
        </ul>
        <h2>Adım Adım Başlangıç Kılavuzu</h2>
        <ol>
          <li>Surfer SEO panelinden "Content Editor" bölümüne girin.</li>
          <li>Hedef anahtar kelimenizi yazın (örn: "yapay zeka araçları") ve lokasyon seçin.</li>
          <li>Surfer analizini tamamlayınca oluşturulan çalışma alanına gidin.</li>
          <li>Metninizi yazarken sağ taraftaki kelimeleri kullanarak puanınızı yeşil bölgeye taşıyın.</li>
        </ol>
        <h2>Avantajlar ve Sınırlar</h2>
        <p><strong>Avantajlar:</strong> SEO sonuçlarında kanıtlanmış etki, yazarlar ve editörler için kusursuz arayüz, WordPress ve Google Docs entegrasyonu.</p>
        <p><strong>Sınırlar:</strong> Kur dengesinden dolayı abonelik ücretleri yüksek olabilir, bazen yapay zeka zorlama kelime eklemeleri önerebilir.</p>
      `
    }
  ];

  for (const t of massiveTools) {
    // Determine category IDs
    const catIds = [];
    for (const catSlug of t.categories) {
      if (categoryMap[catSlug]) {
        catIds.push(categoryMap[catSlug]);
      }
    }

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
        descriptionTr: t.descriptionTr.trim(),
        categories: {
          deleteMany: {},
          create: catIds.map(id => ({
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
        descriptionTr: t.descriptionTr.trim(),
        source: "MANUAL",
        categories: {
          create: catIds.map(id => ({
            category: { connect: { id } }
          }))
        }
      }
    });

    console.log(`  ✓ Inserted/Updated: ${t.name}`);
  }

  console.log("Massive tools seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
