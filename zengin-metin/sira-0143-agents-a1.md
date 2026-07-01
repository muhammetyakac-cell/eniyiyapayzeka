TITLE: Agents-A1: Uzun Süreli Ajan Görevleri İçin 35B MoE Modeli
DATE: 2026-07-01
TAGS: Agents-A1, InternScience, yapay-zeka, ajan, ModelScope
---
Agents-A1, InternScience tarafından geliştirilen ve 30 Haziran 2026'da ModelScope tarafından duyurulan 35 milyar parametrelik bir Mixture-of-Experts ajan modelidir. Apache 2.0 lisansıyla Hugging Face'te yayınlanan model, özellikle uzun soluklu arama, mühendislik, bilimsel araştırma, talimat takibi ve araç çağırma görevleri için optimize edildi. 256K token bağlam penceresiyle geliyor.

Agents-A1, Qwen3.5 MoE mimarisi üzerine inşa edildi ve trilyon parametreli modellerin ajan performansını çok daha küçük bir ağırlıkla yakalamayı hedefliyor. SciCode'da yüzde 44.33, MLE-Lite'da yüzde 43.94 puan alarak 35B sınıfında rekabetçi sonuçlar elde ediyor. HiPhO'da yüzde 37.6 puanıyla fizik alanında da yetenekli olduğunu kanıtlıyor. Özellikle Instruction Follow Bench-v2'de yüzde 94.82 gibi etkileyici bir skorla talimat takibinde üstün performans gösteriyor.

Agents-A1'in en büyük farkı, heterojen ajan ufuklarını (heterogeneous agent horizons) desteklemesidir. Yani aynı model, arama döngüleri, bilimsel araçlar, talimat değerlendirmeleri ve fonksiyon çağırma gibi çok farklı türdeki ajan görevlerini tek bir çatı altında yürütebiliyor. Bu, onu yalnızca kodlama veya yalnızca arama için optimize edilmiş modellerden ayırıyor. vLLM veya SGLang ile çalıştırılabiliyor.

Agents-A1, özellikle uzun soluklu ve çeşitli ajan görevleri için ideal bir seçenek. Eğer tek bir modelle hem bilimsel araştırma hem web arama hem de araç kullanımı yapmanız gerekiyorsa, Agents-A1 bu kategorideki en güçlü açık kaynak alternatif. Model, kurumsal kullanıma uygun Apache 2.0 lisansıyla yayınlandı ve hemen hemen her türlü ticari projede kullanılabiliyor.
