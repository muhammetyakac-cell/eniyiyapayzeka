TITLE: Ornith 1.0: Kendi İskeletini Oluşturan Açık Kaynak Kodlama Modelleri
DATE: 2026-07-01
TAGS: Ornith, DeepReinforce, yapay-zeka, kodlama, acik-kaynak
---
Ornith 1.0, DeepReinforce AI tarafından 25 Haziran 2026'da yayınlanan, agentic kodlama için özel olarak geliştirilmiş bir açık kaynak dil modeli ailesidir. Adını antik Yunancada "kuş" anlamına gelen sözcükten alan Ornith, tıpkı bir kuşun kendi yuvasını inşa etmesi gibi, kodlama görevlerini çözmeden önce kendi orkestrasyon çerçevesini oluşturmayı öğreniyor. Dört farklı boyutta sunuluyor: 9B Dense, 31B Dense, 35B MoE ve 397B MoE.

Ornith 1.0-397B amiral gemisi modeli, Terminal-Bench 2.1'de 77.5, SWE-Bench Verified'da 82.4 puan alarak Claude Opus 4.7'yi geride bırakıyor. Daha küçük olan Ornith 1.0-35B MoE ise 64.2 puanla Qwen 3.5-397B'yi (53.5) çok daha az parametreyle geçiyor. Tüm modeller MIT lisansı altında, herhangi bir bölgesel kısıtlama olmadan Hugging Face üzerinden FP8, GGUF ve bf16 ağırlıklarıyla indirilebiliyor.

Ornith 1.0'ın en büyük yeniliği "self-scaffolding" (kendi kendine iskelet oluşturma) konseptidir. Geleneksel modeller sabit bir orkestrasyon çerçevesi kullanırken, Ornith kodlama görevini çözmeyi ve bu çözümü yönlendirecek çerçeveyi aynı anda öğreniyor. Bu sayede 9B gibi küçük bir model bile etkileyici sonuçlar verebiliyor. 35B MoE varyantı, fiyat-performans dengesi açısından en ideal seçenek olarak öne çıkıyor.

Ornith 1.0, vLLM, Ollama ve LM Studio gibi araçlarla yerel olarak çalıştırılabiliyor. Özellikle 9B modeli, edge cihazlarda çalıştırılabilecek kadar hafifken, 397B modeli veri merkezi seviyesinde performans sunuyor. Açık kaynak kodlama modelleri arasında Ornith 1.0, hem küçük hem büyük ölçekte sunduğu esneklik ve yenilikçi self-scaffolding mimarisiyle dikkat çekiyor.
