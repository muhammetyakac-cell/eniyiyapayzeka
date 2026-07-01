TITLE: LongCat-2.0: Çin'in 1.6 Trilyon Parametrelik Açık Kaynak Kodlama Modeli
DATE: 2026-07-01
TAGS: LongCat-2.0, Meituan, yapay-zeka, kodlama, acik-kaynak
---
LongCat-2.0, Meituan tarafından 30 Haziran 2026'da MIT lisansıyla açık kaynak olarak yayınlanan 1.6 trilyon parametrelik bir Mixture-of-Experts (MoE) modelidir. Her token için yalnızca yaklaşık 48 milyar parametre aktive eden bu model, 1 milyon tokenlik native bağlam penceresiyle geliyor. LongCat-2.0, OpenRouter'da "Owl Alpha" kod adıyla iki ay boyunca sessizce en üst sıralarda yer aldıktan sonra resmen tanıtıldı.

LongCat-2.0, agentic kodlama ve araç kullanımı için özel olarak tasarlandı. Kendi benchmark'larında SWE-bench Pro'da 59.5 puan alarak GPT-5.5'i (58.6) geride bırakıyor. Terminal-Bench 2.1'de ise 70.8 puan elde ediyor. Model, 30 trilyondan fazla token üzerinde eğitildi ve tamamen Çin yapımı ASIC çipleriyle çalışan 50.000 kartlık bir kümede eğitildi. Bu, Nvidia GPU'su olmadan eğitilen ilk trilyon parametreli model olma özelliğini taşıyor.

LongCat-2.0'ın en dikkat çekici yanı, donanım bağımsızlığıdır. Meituan, modeli Nvidia donanımı kullanmadan, tamamen yerli Çin çipleri üzerinde eğitip çalıştırarak ABD ihracat kontrollerine karşı önemli bir alternatif sundu. API fiyatlandırması da oldukça agresif: giriş tokenları için milyonda $0.05, çıkış için $0.30, bu da ABD modellerine kıyasla on kat daha ucuz. Model, OpenRouter üzerinden denenebiliyor ve gerçek dünya kullanımıyla kanıtlanmış bir performans sunuyor.

Açık kaynak kodlama modelleri arasında LongCat-2.0, özellikle büyük bağlam penceresi ve düşük maliyetiyle öne çıkıyor. Repository seviyesinde kod anlama, çok adımlı agent yürütme ve uzun bağlam gerektiren görevler için ideal bir seçenek. MIT lisansı sayesinde ticari kullanıma da tamamen açık olan model, 2026'nın en ilginç açık kaynak sürümlerinden biri olarak kayıtlara geçti.
