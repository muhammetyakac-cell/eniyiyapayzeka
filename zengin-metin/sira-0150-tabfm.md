TITLE: TabFM: Google'ın Tablo Verileri İçin Çığır Açan Temel Modeli
DATE: 2026-07-01
TAGS: TabFM, Google, yapay-zeka, tablo-verisi, temel-model
---
TabFM (Tabular Foundation Model), Google Research tarafından geliştirilen ve tablo halindeki veriler için özel olarak tasarlanmış bir temel modeldir. Sınıflandırma ve regresyon görevlerini veri setine özgü herhangi bir eğitim gerektirmeden, tek bir ileri geçişle (single forward pass) gerçekleştiriyor. Her tahmin, tüm veri setini tek bir prompt olarak okuyup bağlam içi öğrenme (in-context learning) ile yapılıyor.

TabFM'in mimarisi, TabPFN tarzı satır/sütun dikkatini TabICL tarzı bağlam içi öğrenmeyle birleştiriyor. Eğitim için yüz milyonlarca sentetik veri seti kullanıldı. Araştırma ekibi, 38 sınıflandırma ve 13 regresyon görevinden oluşan bir benchmark yayınladı. TabFM, XGBoost gibi geleneksel gradient boosting algoritmalarını hiperparametre optimizasyonu veya özellik mühendisliği gerektirmeden tutarlı bir şekilde geride bırakıyor.

TabFM iki konfigürasyonda sunuluyor: Plain TabFM, tek bir ileri geçişle kutudan çıktığı gibi çalışır - hiçbir tuning veya çapraz doğrulama gerektirmez. TabFM-Ensemble ise çapraz özellikler ve SVD ekler, 32 yönlü bir ensemble için optimal ağırlıkları non-negative least squares çözücüsüyle hesaplar ve sınıflandırma için Platt scaling kalibrasyonu ekler. Her iki versiyon da geleneksel yöntemlerden daha iyi performans gösteriyor.

Google, TabFM'i BigQuery üzerinden AI.PREDICT SQL komutuyla kullanıma sunmayı planlıyor. Model şu anda Hugging Face ve GitHub üzerinde erişilebilir. Veri bilimciler için TabFM, manuel özellik mühendisliği ve hiperparametre optimizasyonu çağını sona erdirebilecek bir yenilik olarak görülüyor. Sıfır-shot tablo tahmini, AI'nın veri bilimindeki en pratik uygulamalarından biri haline geliyor.
