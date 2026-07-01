TITLE: Krolik: Yapay Zeka Ajanları İçin Kod Zekası ve Bilgi Grafiği Platformu
DATE: 2026-07-01
TAGS: krolik, yapay-zeka, kod-analizi, bilgi-grafigi, mcp
---
Krolik, AI ajanlarının kod tabanlarını derinlemesine anlamasını sağlayan bir kod zekası platformu. Tree-sitter AST'leri ile 13 programlama dilini ayrıştıran Krolik, Apache AGE bilgi grafiği ve Prometheus'tan doğrudan `dosya:fonksiyon` seviyesine canlı gözlem köprüsü sunuyor. 28 MCP aracı ile Claude Code, Cursor, Windsurf, Aider ve diğer tüm MCP istemcileriyle çalışıyor.

Krolik'in en güçlü özelliği, hibrit erişim sistemi. BM25F sözcük puanlaması, 768-boyutlu vektör embeddings (jina-code-v2) ve SPLADE seyrek erişimi birleştirerek kod aramasında hem kesinlik hem de kapsam sağlıyor. İsteğe bağlı Rust yardımcıları olan ox-embed-server (ONNX embeddings + cross-encoder rerank) ve ox-codes (derin ölü kod analizi) ile yetenekler daha da genişliyor.

Krolik, Sourcegraph'ten farklı bir yaklaşım benimsiyor. Sourcegraph kodu insanlar için indekslerken, Krolik kodu AI ajanları için indeksliyor. Bilgi grafiği (Apache AGE), çalışma zamanı gözlem köprüsü (Prometheus + Jaeger ile dosya:fonksiyon eşlemesi) ve MCP-native protokol gibi Sourcegraph'te olmayan özellikler sunuyor. Go, Python, TypeScript, TSX, Rust, Java, C, C++, Ruby, C#, PHP, Svelte ve Astro olmak üzere 13 dili destekliyor.

Krolik'in çalışması için yalnızca bir LLM uç noktası (OpenAI-uyumlu) gerekiyor. PostgreSQL + Apache AGE ile kod_grafiği, pgvector + ox-embed-server ile semantik arama ve reranking, ox-codes ile daha derin kod analizi eklenebiliyor. Tüm yardımcılar açık kaynak. 2026'da AI ajanlarının kod tabanlarını insan seviyesinde anlamasını isteyen ekipler için Krolik, benzersiz bir çözüm sunuyor.
