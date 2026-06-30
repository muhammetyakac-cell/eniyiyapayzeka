# eniyiyapayzeka.com — Programatik SEO Projesi Uygulama Planı

## Genel Mimari

| Katman | Teknoloji | Amaç |
|---|---|---|
| **Frontend** | Next.js 15 (App Router) + Shadcn UI + Tailwind v4 | SSR/ISR ile dinamik SEO sayfaları |
| **Backend/API** | Next.js API Routes + Vercel Serverless | Cron job'lar, AI pipeline |
| **Veritabanı** | Neon DB (Serverless PostgreSQL) | Ana veritabanı |
| **ORM** | Prisma | Type-safe DB erişimi, migration yönetimi |
| **Auth** | NextAuth.js v5 (Auth.js) | Admin paneli için kullanıcı girişi |
| **AI Pipeline** | Gemini 2.5 Pro API | Ham veriyi Türkçeleştirme ve zenginleştirme |
| **Hosting** | Vercel (Hobby → Pro) | Edge deployment, ISR, Cron Jobs |
| **ETL Kaynakları** | GitHub API, HuggingFace API, ProductHunt, FutureTools | Veri çekme |

---

## Neon DB Özellikleri ve Limitleri

| Özellik | Free Tier | Bizim Senaryo |
|---|---|---|
| **Compute** | 1 primary compute (0.25 CU) | Cron job'lar hafif, yeterli |
| **Storage** | 0.5 GB (branch başına) | 5000 araç ~50 MB, rahat |
| **Branches** | 10 branch | Dev/Prod ayrımı için ideal |
| **Connection pool** | 100 eş zamanlı | PgBouncer ile edge-friendly |
| **Point-in-time recovery** | 7 gün | Ücretsiz |
| **Pausing** | Inaktivitede scale-to-zero | Cron job haftada 2 kez → **pause olmaz** |
| **Neon serverless driver** | HTTP tabanlı, edge-ready | Vercel Edge Runtime'da çalışır |

### Neon vs Supabase Karşılaştırması

| Özellik | Neon | Supabase |
|---|---|---|
| **Database** | ✅ Serverless PG, branching | ✅ Serverless PG |
| **Edge uyumluluğu** | ✅ HTTP driver, PgBouncer | ⚠️ TCP, connection pooling |
| **Branching (dev/staging)** | ✅ Instant branch | ❌ Ek ücretli |
| **Auth** | ❌ | ✅ Ücretsiz |
| **Storage** | ❌ | ✅ 1 GB ücretsiz |
| **Realtime** | ❌ | ✅ Websocket |
| **Scale-to-zero** | ✅ 5 dk inaktivitede | ❌ Pro gerektirir |

**Karar**: Neon DB + NextAuth.js v5 kombinasyonu. Auth ihtiyacını NextAuth.js karşılıyor, storage ihtiyacı yok (sadece metin verisi), realtime ihtiyacı yok.

---

## 1. Hafta — Temel Atma

### 1.1 Proje İskeleti

```bash
npx create-next-app@latest eniyiyapayzeka --typescript --tailwind --eslint --app --src-dir
```

- Shadcn UI init: `npx shadcn@latest init`
- Temel bileşenler: Button, Card, Badge, Input, Sheet, Command (arama için), Skeleton
- Prisma: `npm install prisma @prisma/client`, `npx prisma init`
- NextAuth.js v6: `npm install next-auth@beta @auth/prisma-adapter`
- Neon serverless driver: `npm install @neondatabase/serverless`

### 1.2 Neon DB Proje Kurulumu

- `console.neon.tech` → Yeni proje → DB şifresi kaydet
- Connection string'i `.env.local` dosyasına koy
- `.env`:
  ```
  DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/db?sslmode=require"
  DIRECT_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/db?sslmode=require"
  GEMINI_API_KEY=...
  AUTH_SECRET=openssl rand -hex 32
  AUTH_GITHUB_ID=... (opsiyonel, admin login için)
  AUTH_GITHUB_SECRET=...
  GITHUB_TOKEN=... (API rate limit bypass için)
  ```

### 1.3 Prisma Şeması

#### `prisma/schema.prisma`

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum PricingModel {
  FREE
  FREEMIUM
  PAID
  OPEN_SOURCE
}

enum ToolSource {
  GITHUB
  HUGGINGFACE
  PRODUCTHUNT
  FUTURETOOLS
  MANUAL
}

model Category {
  id            String         @id @default(cuid())
  slug          String         @unique
  nameTr        String         @map("name_tr")
  descriptionTr String?        @map("description_tr")
  icon          String?
  createdAt     DateTime       @default(now()) @map("created_at")
  tools         ToolCategory[]

  @@map("categories")
}

model AiTool {
  id               String         @id @default(cuid())
  slug             String         @unique
  name             String
  descriptionTr    String?        @map("description_tr")
  websiteUrl       String?        @map("website_url")
  githubUrl        String?        @map("github_url")
  pricingModel     PricingModel   @default(FREE) @map("pricing_model")
  hardwareReq      String?        @map("hardware_req")
  starsCount       Int?           @map("stars_count")
  source           ToolSource     @default(MANUAL)
  featured         Boolean        @default(false)
  metaTitle        String?        @map("meta_title")
  metaDescription  String?        @map("meta_description")
  useCases         String[]       @default([]) @map("use_cases")
  bestFor          String?        @map("best_for")
  createdAt        DateTime       @default(now()) @map("created_at")
  updatedAt        DateTime       @updatedAt @map("updated_at")
  categories       ToolCategory[]
  prompts          Prompt[]
  comparisonsA     Comparison[]   @relation("ToolA")
  comparisonsB     Comparison[]   @relation("ToolB")

  @@index([slug])
  @@index([featured])
  @@index([pricingModel])
  @@index([source])
  @@map("ai_tools")
}

model ToolCategory {
  toolId     String   @map("tool_id")
  categoryId String   @map("category_id")
  tool       AiTool   @relation(fields: [toolId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([toolId, categoryId])
  @@map("tool_categories")
}

model Prompt {
  id         String   @id @default(cuid())
  toolId     String?  @map("tool_id")
  title      String
  promptText String   @map("prompt_text")
  useCase    String?  @map("use_case")
  categoryId String?  @map("category_id")
  createdAt  DateTime @default(now()) @map("created_at")
  tool       AiTool?  @relation(fields: [toolId], references: [id], onDelete: SetNull)
  category   Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@index([toolId])
  @@index([categoryId])
  @@map("prompts")
}

model Comparison {
  id        String   @id @default(cuid())
  slug      String   @unique
  toolAId   String   @map("tool_a_id")
  toolBId   String   @map("tool_b_id")
  contentTr Json     @map("content_tr")
  createdAt DateTime @default(now()) @map("created_at")
  toolA     AiTool  @relation("ToolA", fields: [toolAId], references: [id], onDelete: Cascade)
  toolB     AiTool  @relation("ToolB", fields: [toolBId], references: [id], onDelete: Cascade)

  @@index([slug])
  @@map("comparisons")
}

model FailedJob {
  id        String    @id @default(cuid())
  source    ToolSource
  rawData   Json      @map("raw_data")
  error     String
  retries   Int       @default(0)
  createdAt DateTime  @default(now()) @map("created_at")
  resolved  Boolean   @default(false)

  @@index([resolved])
  @@map("failed_jobs")
}

// NextAuth.js modelleri
model Account {
  id                String  @id @default(cuid())
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?
  emailVerified DateTime? @map("email_verified")
  image         String?
  accounts      Account[]
  sessions      Session[]

  @@map("users")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

### 1.4 Ana Sayfa ve Dizin UI

- `/` → Hero section (`"Türkiye'nin En Kapsamlı Yapay Zeka Araçları Dizini"`) + featured araçlar grid + son eklenenler
- `/araclar` → Filtreleme (kategori, fiyat, arama) + pagination
- `/kategoriler` → Tüm kategoriler grid'i
- `/promptlar` → Prompt kütüphanesi listesi
- Breadcrumb navigasyon tüm sayfalarda

### 1.5 Seed Script (`scripts/seed.ts`)

- `npx tsx scripts/seed.ts` ile çalışan script
- 50-75 popüler AI aracının statik verisi (isim, URL, GitHub URL, kategori)
- Herbiri için Gemini API çağrısı → `description_tr`, `meta_title`, `meta_description`, `use_cases`, `pricing_model`, `hardware_req`, `best_for`
- Prisma `upsert` ile batch insert (rate-limit'li)
- Kullanılacak araç listesi: ChatGPT, Claude, Gemini, Midjourney, DALL-E, Stable Diffusion, GitHub Copilot, Cursor, Windsurf, Perplexity, Claude Code, DeepSeek, Llama, Mistral, Ollama, LM Studio, ComfyUI, RunwayML, Sora, Suno, Udio, ElevenLabs, HeyGen, Synthesia, Notion AI, Jasper, Copy.ai, Writesonic, Rytr, Beautiful.ai, Gamma, Replit Agent, Bolt.new, Lovable, v0.dev, Cursor AI, Cody, Codeium, Tabnine, Continue.dev, Aider, OpenHands, Devika, MetaGPT, AutoGPT, BabyAGI, CrewAI, LangChain, LlamaIndex, ...

---

## 2. Hafta — Otomasyon (ETL Pipeline)

### 2.1 ETL Kaynak Fetcher'ları

#### `lib/fetchers/github.ts`
- `GET /search/repositories?q=topic:llm+topic:ai+created:>{7_gün_önce}&sort=stars&order=desc`
- Headers: `Authorization: Bearer {GITHUB_TOKEN}` (rate limit: 5000/saat)
- Dönen repo: full_name, description, html_url, stargazers_count, language, topics

#### `lib/fetchers/huggingface.ts`
- `GET https://huggingface.co/api/models?sort=downloads&direction=-1&limit=20&filter=transformers`
- Dönen model: modelId, pipeline_tag, downloads, likes, tags

#### `lib/fetchers/producthunt.ts`
- `GET https://api.producthunt.com/v2/api/graphql` → AI topics filter
- Gereken: ProductHunt API token (Developer Account)
- Alternatif: PH RSS feed scraping

#### `lib/fetchers/futuretools.ts`
- Cheerio ile FutureTools.io scraping
- Sayfada `.tool-card` benzeri elementleri parse et
- Rate limited scraping (saniyede 1 istek)

### 2.2 AI Zenginleştirme Pipeline (`lib/ai-enrich.ts`)

```typescript
// Gemini 2.5 Pro Prompt (Sistem promptu)
const SYSTEM_PROMPT = `Sen bir Türk SEO içerik editörüsün. 
Aşağıdaki yapay zeka aracı verisini incele. 
Tamamen Türkçe olarak, SEO uyumlu ve doğal bir dil ile şu JSON'ı üret:

{
  "description_tr": "3 paragraflık, hedef kitleyi yakalayan, fayda odaklı Türkçe açıklama (300-400 kelime). Başlıklar H2 formatında olsun.",
  "meta_title": "60-70 karakter arası SEO başlık. Format: '{Araç Adı} Nedir, Ne İşe Yarar? | En İyi Yapay Zeka Araçları'",
  "meta_description": "150-160 karakter arası meta açıklaması. Anahtar kelime içermeli.",
  "use_cases": ["3-5 adet gerçek kullanım alanı, her biri 5-10 kelime"],
  "pricing_model": "Detaylı fiyatlandırma bilgisi (ücretsiz/freemium/ücretli/açık kaynak), varsa spesifik plan fiyatları",
  "hardware_req": "Donanım gereksinimi. Eğer yerel çalıştırılabiliyorsa GPU/RAM ihtiyacı, cloud-only ise belirt",
  "best_for": "Hangi kullanıcı tipi için ideal (örn: Yazılımcılar, İçerik üreticileri, Tasarımcılar)"
}

ÖNEMLİ KURALLAR:
- JSON dışında hiçbir metin üretme.
- Tüm çıktı Türkçe olmalı.
- description_tr HTML etiketleri içerebilir (<h2>, <p>, <ul>, <li>).
- use_cases her biri spesifik ve gerçekçi olmalı.
- Eğer veri eksikse tahmin yürütme, "Bilgi mevcut değil" yaz.`;

// Rate limiting wrapper
const enrichTool = async (toolData: RawToolData): Promise<EnrichedData> => {
  // 15 RPM limit for free tier Gemini
  // p-limit ile concurrent kontrol: concurrency 3
  // Retry: 3 kez, exponential backoff (1s, 4s, 16s)
};
```

### 2.3 Cron Job API Route

#### `/api/cron/fetch-and-enrich/route.ts`
```typescript
// Vercel Cron Job ile çağrılacak endpoint
// 1. Tüm fetcher'ları paralel çalıştır
// 2. Gelen verileri slug'a göre deduplicate et (DB sorgusu)
// 3. Yeni araçları enrichment queue'ya al
// 4. Batch enrichment (p-limit concurrency: 3)
// 5. Başarılıları Prisma upsert ile DB'ye yaz
// 6. Başarısızları failed_jobs tablosuna kaydet
// 7. Next.js revalidatePath('/araclar') ile ISR cache temizle
```

#### `vercel.json` Cron Yapılandırması
```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-and-enrich",
      "schedule": "0 3 * * 1,4"
    },
    {
      "path": "/api/cron/retry-failed",
      "schedule": "0 4 * * 0"
    }
  ]
}
```

- **Hobby plan**: 1 cron job / proje
- **Pro plan ($20/ay)**: 40 cron job / proje
- **Max execution**: 300 saniye (Hobby), 900 saniye (Pro)
- Gemini ücretsiz tier: 15 RPM → 300 saniyede ~45 enrichment yapılabilir (Hobby sınırı)

### 2.4 Deduplication ve Error Handling

- Slug bazlı dedup (Prisma `findUnique`)
- GitHub repo URL dedup'ı (aynı repo farklı kaynaktan gelirse atla)
- Gemini API failure → 3 retry → `failed_jobs` tablosuna kayıt
- `/api/cron/retry-failed` endpoint'i Pazar günü çalışır → 30 günden eski failed'ları temizle, kalanları tekrar dene

---

## 3. Hafta — Frontend Entegrasyonu

### 3.1 Dinamik Rotalar (Next.js App Router)

| Route | Sayfa | Render Stratejisi | Açıklama |
|---|---|---|---|
| `/` | Ana sayfa | SSR | Hero + featured + son eklenenler |
| `/araclar` | Araç dizini | ISR (1 saat) | Filtreleme + pagination |
| `/araclar/[slug]` | Araç detay | ISR (1 saat) | AI özeti + prompt kartları + özellik tablosu |
| `/kategoriler` | Kategoriler listesi | ISR (1 gün) | Tüm kategoriler |
| `/kategori/[slug]` | Kategori toplu sayfası | ISR (1 gün) | Kategoriye ait tüm araçlar |
| `/karsilastirma` | Karşılaştırmalar listesi | ISR (1 gün) | Popüler kıyaslamalar |
| `/karsilastirma/[slug]` | Karşılaştırma detay | SSR | Tik/çarpı tablosu + AI metni |
| `/promptlar` | Prompt kütüphanesi | ISR (1 saat) | Prompt listesi + filtreleme |
| `/promptlar/[id]` | Prompt detay | ISR (1 saat) | Prompt metni + kopyalama + benzer promptlar |
| `/admin` | Admin paneli | SSR (auth protected) | Manuel araç ekleme/düzenleme |

### 3.2 Dinamik Meta Etiketleri + Structured Data

```typescript
// src/app/araclar/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const tool = await getToolBySlug(params.slug);

  return {
    title: tool.metaTitle || `${tool.name} Nedir, Ne İşe Yarar? | eniyiyapayzeka.com`,
    description: tool.metaDescription || `${tool.name} hakkında detaylı Türkçe inceleme...`,
    alternates: { canonical: `https://eniyiyapayzeka.com/araclar/${tool.slug}` },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      type: 'article',
      url: `https://eniyiyapayzeka.com/araclar/${tool.slug}`,
      siteName: 'eniyiyapayzeka.com',
      locale: 'tr_TR',
    },
  };
}
```

#### Schema.org JSON-LD Çeşitleri

**Araç Detay Sayfası** — `SoftwareApplication`:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Claude 3.5 Sonnet",
  "applicationCategory": "AIApplication",
  "operatingSystem": "Web",
  "description": "...",
  "offers": { "@type": "Offer", "price": "20", "priceCurrency": "USD" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "..." }
}
```

**+ FAQPage Schema**: 3 AI ile oluşturulmuş soru/cevap
**+ BreadcrumbList Schema**: Her sayfada

**Karşılaştırma Sayfası** — `Product + Comparison`:
- İki `SoftwareApplication` node + karşılaştırma tablosu verisi

**Kategori Sayfası** — `CollectionPage` + `ItemList`

### 3.3 Sayfa Bileşenleri ve Tasarım

#### Araç Detay Sayfası Bileşenleri:
1. **ToolHero**: İsim, short desc, pricing badge (color-coded: yeşil=ücretsiz, mavi=freemium, turuncu=ücretli, mor=açık kaynak), GitHub stars, website CTA button
2. **ToolDescription**: AI tarafından yazılmış 3 paragraflık HTML içerik (`dangerouslySetInnerHTML` ile render ama sanitize edilmiş)
3. **ToolSpecsTable**: Fiyatlandırma, Donanım gereksinimi, Kaynak tipi, GitHub stars, Kategoriler
4. **BestPromptsSection**: Bu araca bağlı en popüler 3 prompt, her biri PromptCard içinde
5. **SimilarTools**: Aynı kategoriden 4 araç (ToolCard grid)
6. **Breadcrumb**: `Ana Sayfa > {Kategori Adı} > {Araç Adı}`

#### Araç Kartı (ToolCard):
- İsim + kısa açıklama (ilk 100 karakter)
- Pricing badge
- GitHub stars
- "İncele" butonu → `/araclar/[slug]`

#### Arama (Command/⌘K):
- Shadcn Command bileşeni
- `/api/search` endpoint → `ilike` sorgusu ile full-text arama
- Debounced input (300ms)

### 3.4 Internal Linking Stratejisi

| Sayfa Tipi | İçerdiği Linkler |
|---|---|
| **Ana sayfa** | → `/araclar`, `/kategoriler`, `/promptlar`, featured araçlar |
| **Araç detay** | → kategori sayfası, "Benzer Araçlar" kartları (4 adet), breadcrumb |
| **Kategori** | → her araç detay sayfası, alt kategoriler |
| **Karşılaştırma** | → iki aracın detay sayfası, kategori sayfaları |
| **Prompt** | → bağlı olduğu araç detayı, bağlı olduğu kategori |

---

## 4. Hafta — Lansman ve İndeksleme

### 4.1 Sitemap.xml

- Statik sayfalar: `/`, `/araclar`, `/kategoriler`, `/promptlar`, `/karsilastirma`
- Dinamik slug'lar API route ile üretilir: `/api/sitemap`
- `next-sitemap` paketi kullanılır veya manuel generation

```typescript
// src/app/sitemap.ts (Next.js native sitemap)
export default async function sitemap() {
  const tools = await getAllTools();
  const categories = await getAllCategories();
  const comparisons = await getAllComparisons();

  const toolUrls = tools.map(t => ({
    url: `https://eniyiyapayzeka.com/araclar/${t.slug}`,
    lastModified: t.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // ... kategori ve karşılaştırma URL'leri de benzer şekilde

  return [
    { url: 'https://eniyiyapayzeka.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    ...toolUrls,
    ...categoryUrls,
    ...comparisonUrls,
  ];
}
```

### 4.2 robots.ts

```typescript
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://eniyiyapayzeka.com/sitemap.xml',
  };
}
```

### 4.3 Google Search Console + İndeksleme

- `search.google.com` → Domain property olarak ekle (DNS TXT doğrulaması)
- Sitemap submit: `https://eniyiyapayzeka.com/sitemap.xml`
- "URL inspection" ile ilk 100 araç sayfasının indeksleme talebi
- Core Web Vitals takibi

### 4.4 Analytics & Monitoring

- **Vercel Analytics**: Ücretsiz, Web Vitals + sayfa görüntülemeleri
- **Neon Monitoring**: Dashboard üzerinden CPU/memory/connection metrikleri
- **Error tracking**: Vercel Logs (Pro plan) veya Sentry (ücretsiz tier)
- **Rate limit monitoring**: Gemini API ve GitHub API usage takibi

### 4.5 Lighthouse Hedefleri

| Metrik | Hedef |
|---|---|
| **Performance** | >90 |
| **Accessibility** | >95 |
| **Best Practices** | >95 |
| **SEO** | 100 |
| **Cumulative Layout Shift** | <0.1 |
| **Largest Contentful Paint** | <2.5s (ISR ile) |
| **First Contentful Paint** | <1.8s |

---

## 4 Haftalık Sprint Planı

### 1. Hafta — Sprint 1: Temel Atma

| Gün | Konkre Görevler | Çıktı |
|---|---|---|
| **Pzt** | `create-next-app`, Shadcn init, Prisma init, Neon DB bağlantısı | Boş ama çalışan skeleton |
| **Sal** | Prisma şemasının finalize edilmesi, `npx prisma db push` ile DB oluşturma | Canlı Neon DB, doğru şema |
| **Çrş** | Ana sayfa UI + ToolCard + ToolGrid + ToolFilters bileşenleri | `/` ve `/araclar` sayfası (boş data ile) |
| **Prş** | Shadcn Command search + filtreleme (kategori, fiyat) implementasyonu | Arama çubuğu + filtreleme çalışıyor |
| **Cum** | Kategoriler sayfası (`/kategoriler`, `/kategori/[slug]`) + breadcrumb bileşeni | Kategori navigasyonu tamam |
| **Cmt** | Seed script: 50 popüler araç listesi hazırla + Gemini enrichment batch test | 50 araç statik data hazır |
| **Paz** | Seed script çalıştırma + Supabase'de veriyi canlı görme | **DB'de 50 zenginleştirilmiş araç** ✅ |

### 2. Hafta — Sprint 2: Otomasyon

| Gün | Konkre Görevler | Çıktı |
|---|---|---|
| **Pzt** | `github.ts` fetcher + `/api/cron` endpoint (tek kaynak test) | GitHub'dan veri çekme çalışıyor |
| **Sal** | `huggingface.ts` + `producthunt.ts` + `futuretools.ts` fetcher'ları | 4 kaynak da aktif |
| **Çrş** | `ai-enrich.ts` Gemini pipeline (JSON parsing, retry, rate limiting) | Ham veri → Türkçe JSON zenginleştirme |
| **Prş** | Cron job `vercel.json` yapılandırması + staging deploy + log test | Otomatik veri akışı çalışıyor |
| **Cum** | `failed_jobs` tablosu + `/api/cron/retry-failed` endpoint'i | %0 kalıcı veri kaybı |
| **Cmt** | Edge case test: duplicate slug, API timeout, malformed JSON | Hata senaryoları handle ediliyor |
| **Paz** | 4 saatlik cron job manuel çalıştırma + sonuçları denetleme | **Otomasyon loop'u stabil** ✅ |

### 3. Hafta — Sprint 3: Frontend Entegrasyonu

| Gün | Konkre Görevler | Çıktı |
|---|---|---|
| **Pzt** | `[slug]` araç detay sayfası: AI metni render, özellik tablosu, CTA | `/araclar/claude-3-5-sonnet-nedir` canlı |
| **Sal** | `generateMetadata` + JSON-LD structured data tüm sayfa tipleri için | Full SEO markup (Breadcrumb, FAQ, SoftwareApp) |
| **Çrş** | Kıyaslama sayfaları (`/karsilastirma/[slug]`): yan yana layout, tik/çarpı tablosu | ChatGPT vs Copilot sayfası |
| **Prş** | Prompt sayfaları (`/promptlar/[id]`): prompt metni, kopyalama butonu, benzer promptlar | Prompt kütüphanesi tamam |
| **Cum** | Internal linking audit: breadcrumb tutarlılığı, benzer araçlar, cross-link kontrol | Tam internal link graph |
| **Cmt** | CS50: Mobile-first responsive test, loading skeletons, empty states | Her state için UI var |
| **Paz** | Admin paneli (NextAuth.js protected): manuel araç ekleme/düzenleme | **Full feature set tamam** ✅ |

### 4. Hafta — Sprint 4: Lansman

| Gün | Konkre Görevler | Çıktı |
|---|---|---|
| **Pzt** | Sitemap generation (`src/app/sitemap.ts`) + robots.txt | `sitemap.xml` canlı, tüm URL'ler listeli |
| **Sal** | GSC kaydı (DNS TXT doğrulama), sitemap submit, ilk 100 indeksleme talebi | Google Search Console aktif |
| **Çrş** | Vercel Analytics + Neon monitoring dashboard setup + Sentry/Vercel Logs | Canlı metrikler ve hata takibi |
| **Prş** | Final polish: Lighthouse audit, broken link checker, mobile responsive test | >90 Lighthouse tüm sayfalarda |
| **Cum** | Launch checklist: DNS, SSL kontrolü, `eniyiyapayzeka.com` yönlendirme, GitHub push | **DOMAIN CANLI** |
| **Cmt** | Post-launch: cron job ilk çalışmasını izle, Google indeksleme durumu kontrol et | Sistem kendi kendine büyüyor |
| **Paz** | Buffer günü: beklenmeyen sorunları çöz, ilk 24 saat metriklerini değerlendir | Stabil operasyon |

---

## Proje Dosya Yapısı

```
eniyiyapayzeka/
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── layout.tsx                  # Root layout (NextAuth + Analytics wrapper)
│   │   ├── page.tsx                    # Ana sayfa
│   │   ├── arac/                     # /arac
│   │   │   ├── layout.tsx            # Breadcrumb + sidebar layout
│   │   │   ├── page.tsx              # /arac
│   │   │   └── [slug]/page.tsx       # /arac/[slug] (detay)
│   │   ├── kategori/
│   │   │   └── [slug]/page.tsx       # /kategori/[slug]
│   │   ├── karsilastirma/
│   │   │   ├── page.tsx              # Kıyaslama listesi
│   │   │   └── [slug]/page.tsx       # /karsilastirma/[slug]
│   │   ├── prompt/
│   │   │   ├── page.tsx              # Prompt listesi
│   │   │   └── [id]/page.tsx         # /prompt/[id]
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Auth guard layout
│   │   │   └── page.tsx              # Admin paneli
│   │   ├── api/
│   │   │   ├── cron/
│   │   │   │   ├── fetch-and-enrich/route.ts   # Ana cron endpoint
│   │   │   │   └── retry-failed/route.ts       # Failed job retry
│   │   │   ├── search/route.ts       # API search endpoint
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/route.ts  # NextAuth.js handler
│   │   │   └── manual-enrich/route.ts # Admin panel için tekil enrichment
│   │   ├── robots.ts                  # robots.txt
│   │   └── sitemap.ts                 # sitemap.xml (dinamik)
│   ├── components/
│   │   ├── ui/                        # Shadcn UI bileşenleri (auto-generated)
│   │   ├── tools/
│   │   │   ├── tool-card.tsx          # Araç kartı (listing)
│   │   │   ├── tool-filters.tsx       # Filtreleme barı
│   │   │   ├── tool-grid.tsx          # Araç grid layout (responsive)
│   │   │   ├── tool-hero.tsx          # Detay sayfası hero
│   │   │   ├── tool-specs-table.tsx   # Özellik tablosu
│   │   │   ├── tool-description.tsx   # AI metni renderer
│   │   │   ├── tool-comparison.tsx    # Karşılaştırma tablosu
│   │   │   └── similar-tools.tsx      # Benzer araçlar section
│   │   ├── prompts/
│   │   │   ├── prompt-card.tsx
│   │   │   └── prompt-list.tsx
│   │   ├── comparison/
│   │   │   └── comparison-table.tsx   # Tik/çarpı tablosu
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   └── search-command.tsx     # ⌘K arama
│   │   └── seo/
│   │       ├── json-ld.tsx            # Structured data wrapper
│   │       └── schema/                # Schema generators
│   ├── lib/
│   │   ├── prisma.ts                  # Prisma client singleton (Neon serverless)
│   │   ├── ai-enrich.ts               # Gemini enrichment pipeline
│   │   ├── fetchers/
│   │   │   ├── github.ts              # GitHub API fetcher
│   │   │   ├── huggingface.ts         # HuggingFace API fetcher
│   │   │   ├── producthunt.ts         # ProductHunt fetcher
│   │   │   └── futuretools.ts         # FutureTools scraper (cheerio)
│   │   ├── db/
│   │   │   ├── tools.ts               # ai_tools CRUD helpers
│   │   │   ├── categories.ts          # kategoriler helpers
│   │   │   ├── prompts.ts             # promptlar helpers
│   │   │   └── comparisons.ts         # karsilastirmalar helpers
│   │   ├── auth.ts                    # NextAuth.js config
│   │   ├── utils/
│   │   │   ├── slugify.ts             # Türkçe-friendly slug: claude-3-5-sonnet-nedir
│   │   │   ├── rate-limit.ts          # API rate limiter (p-limit wrapper)
│   │   │   ├── deduplicate.ts         # Slug + URL dedup logic
│   │   │   ├── sanitize-html.ts       # AI HTML çıktısı sanitizer (DOMPurify)
│   │   │   └── seo.ts                 # Canonical URL, meta helper'lar
│   │   └── env.ts                     # Environment variable validation (zod)
│   ├── hooks/
│   │   ├── use-debounce.ts
│   │   ├── use-tool-search.ts
│   │   └── use-pagination.ts
│   └── types/
│       ├── tools.ts                   # Frontend-specific Tool tipi
│       └── enrichment.ts              # Gemini dönüş JSON tipi
├── scripts/
│   ├── seed.ts                        # İlk 50-75 aracın seed'i
│   └── manual-enrich.ts               # Tekil enrichment test script
├── prisma/
│   ├── schema.prisma                  # Tüm model tanımları
│   └── migrations/                    # Prisma auto-generated
├── public/
│   └── images/
│       └── og-default.png             # Default Open Graph image
├── vercel.json                        # Cron job config
├── next.config.ts
├── tailwind.config.ts
├── package.json
├── .env.local                         # Yerel geliştirme environment
├── .env                               # Neon DATABASE_URL (gitignore!)
└── plan.md                            # Bu dosya
```

---

## Anahtar SEO Kararları

| Karar | Değer | Gerekçe |
|---|---|---|
| **Slug formatı** | `claude-3-5-sonnet-nedir` | "nedir" eki Türkçe arama sorgularıyla birebir eşleşir ("Claude 3.5 Sonnet nedir") |
| **Kategori slug'ları** | `acik-kaynak-kod-yazma-yapay-zeka-araclari` | Long-tail keyword hedefleme |
| **Karşılaştırma slug'ları** | `chatgpt-vs-github-copilot` | "vs" querie'leri yüksek dönüşüm getirir |
| **ISR revalidate** | Araç sayfaları 1 saat, kategori sayfaları 1 gün | Tazelik/performans dengesi |
| **Canonical URL** | Tüm sayfalara otomatik basılır | Duplicate content önleme |
| **Internal linking** | Breadcrumb + benzer araçlar + kategori linkleri | Crawl budget optimizasyonu |
| **Schema markup** | SoftwareApplication + FAQPage + BreadcrumbList | Rich snippet potansiyeli |
| **Meta dil** | `locale: 'tr_TR'`, `lang="tr"` tüm sayfalarda | Google'ın Türkçe site olarak algılaması |
| **Domain dili** | `.com` global TLD + Türkçe içerik | Global ulaşılabilirlik, Türkçe içerik |

---

## Başlangıç İçin İhtiyaç Listesi

- [ ] **Neon DB hesabı**: `console.neon.tech` → Free tier proje (DB name: `eniyiyapayzeka`)
- [ ] **Vercel hesabı**: `vercel.com` → GitHub ile bağla
- [ ] **Gemini API key**: `aistudio.google.com` → "Get API Key" → Free tier (60 RPM, 15 RPM prompt limit)
- [ ] **GitHub Personal Access Token**: Settings → Developer settings → Personal access tokens → `public_repo` scope
- [ ] **Domain**: `eniyiyapayzeka.com` kaydı (Cloudflare DNS yönetimi önerilir)
- [ ] **GitHub repo**: Projeyi push'layacağın repo (public)
- [ ] **Node.js 20+**: Lokal geliştirme ortamı

---

## Maliyet Özeti (İlk 6 Ay)

| Servis | Plan | Aylık Maliyet | Yıllık |
|---|---|---|---|
| **Neon DB** | Free Tier | $0 | $0 |
| **Vercel** | Hobby → Pro ($20) | $0 → $20 | $0 → $240 |
| **Gemini API** | Free Tier (60 RPM) | $0 | $0 |
| **Domain** | Namecheap `.com` | ~$1.5/ay | ~$18 |
| **GitHub API** | Free (PAT ile 5000/saat) | $0 | $0 |
| **TOPLAM** | | **$0 → $21.5/ay** | **$0 → $258/yıl** |

---

## Riskler ve Mitigasyonlar

| Risk | Olasılık | Etki | Mitigasyon |
|---|---|---|---|
| **Gemini API rate limit aşımı** | Orta | Veri zenginleştirilemez | `p-limit` concurrency 3, retry queue, failed_jobs tablosu |
| **Neon DB scale-to-zero** | Düşük | Cron job başlangıcında latency | Cron job haftada 2 kez → pause asla tetiklenmez |
| **GitHub API rate limit** | Düşük | Veri çekilemez | PAT ile 5000/saat (anon: 60/saat) |
| **AI hallucination** | Orta | Yanlış açıklamalar | `ai-enrich.ts` output validation (JSON parse kontrolü, required field check), manual review flag |
| **ISR cache stale** | Düşük | Güncel olmayan sayfalar | 1 saat revalidate + on-demand revalidation via `/api/revalidate` |
| **Duplicate content (SEO)** | Düşük | Google penalty | Unique slug constraint + canonical URL + unique meta descriptions |
| **ProductHunt API deprecation** | Yüksek | Bir kaynak kaybı | Fallback: RSS scraping ile aynı veri alınabilir |
| **Vercel Hobby cron limit** | Geçici | 1 cron job sınırı | Pro'ya geç ($20) — 40 cron job, 900s execution |

---

## Başarı Metrikleri (İlk 3 Ay Hedefleri)

| Metrik | 1. Ay | 2. Ay | 3. Ay |
|---|---|---|---|
| **Araç sayısı (DB)** | 75 (seed + cron) | 200+ | 500+ |
| **İndekslenen sayfa** | 50 | 150+ | 400+ |
| **Günlük organik tık** | 10-50 | 100-300 | 500-1500 |
| **CTR (Google)** | %1-3 | %2-5 | %3-7 |
| **Ortalama pozisyon** | 30-50 | 10-30 | 1-15 (long-tail'lerde) |
| **Bounce rate** | >%70 | <%60 | <%50 |

---

## Sonraki Aşamalar (Post-Launch 2.-3. Ay)

1. **Prompt marketplace**: Kullanıcıların prompt yükleyip paylaşabildiği bölüm
2. **AI araç karşılaştırma oylaması**: Ziyaretçiler araçları puanlayabilir
3. **Haftalık bülten**: En yeni 5 AI aracının e-posta ile gönderimi
4. **Affiliate link'ler**: Araçların affiliate programları varsa yönlendirme linkleri
5. **API endpoint**: Diğer sitelerin veriyi çekebilmesi için public API
6. **Multi-language**: İngilizce versiyonu için `eniyiyapayzeka.com/en/` rotası

---

*Bu plan 30 Haziran 2026'da oluşturulmuştur. Proje ilerledikçe güncellenecektir.*