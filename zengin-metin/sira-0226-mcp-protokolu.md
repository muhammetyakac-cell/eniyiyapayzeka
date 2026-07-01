# MCP Protokolü Nedir?

MCP (Model Context Protocol), Anthropic tarafından 2024 sonunda tanıtılan ve AI modellerinin dış araçlarla, veri kaynaklarıyla ve servislerle standart bir şekilde iletişim kurmasını sağlayan açık bir protokoldür. MCP öncesinde her AI framework'ünün kendi araç tanımlama sistemi vardı (LangChain Tools, OpenAI Functions, AutoGen Tools) ve bu sistemler birbiriyle uyumsuzdu. MCP, tüm bu sistemleri tek bir standart altında birleştirerek AI araç ekosisteminde bir dönüm noktası oldu.

MCP'nin çalışma prensibi JSON-RPC tabanlıdır. Bir MCP sunucusu, kullanıma sunduğu araçların şemalarını tanımlar. Bir MCP istemcisi (AI modeli veya aracı), bu araçları keşfeder ve gerektiğinde çağırır. Örneğin, bir PostgreSQL MCP sunucusu `query_database` adında bir araç sunar; AI modeli bu aracın şemasını alır, gerekli parametreleri doldurur ve çağırır. MCP sayesinde bir araç bir kez yazılır ve MCP uyumlu tüm istemciler tarafından kullanılabilir.

2026 itibarıyla MCP, AI endüstrisinde fiili standart haline gelmiştir. Claude Desktop, Claude Code, Cursor, Continue, Cody, Zed ve birçok AI aracı MCP'yi yerel olarak desteklemektedir. Yaygın MCP sunucuları arasında GitHub MCP (issue, PR, commit yönetimi), PostgreSQL MCP (veritabanı sorgulama), Brave Search MCP (web arama), Filesystem MCP (dosya erişimi) ve Linear MCP (görev yönetimi) bulunur.

MCP ile Google'ın A2A (Agent-to-Agent) protokolü birbirini tamamlar. MCP, bir AI modelinin araçlara nasıl erişeceğini tanımlarken, A2A birden fazla agent'ın birbiriyle nasıl iletişim kuracağını tanımlar. Genel mimaride, agent'lar A2A ile koordinasyon sağlarken MCP ile araçlara erişir. MCP'nin getirdiği bu standartlaşma, AI araç ekosisteminin hızla büyümesini ve farklı sistemlerin sorunsuzca entegre olmasını mümkün kılmıştır.
