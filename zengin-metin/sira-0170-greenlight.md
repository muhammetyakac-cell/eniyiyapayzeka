TITLE: Greenlight: Apple App Store Ön Gönderim Uyumluluk Tarayıcısı
DATE: 2026-07-01
TAGS: Greenlight, RevylAI, ios, app-store, yapay-zeka
---
Greenlight, RevylAI tarafından geliştirilen ve uygulamalarınızı Apple App Store'a göndermeden önce uyumluluk denetimi yapan açık kaynak bir CLI aracıdır. MIT lisansıyla yayınlanan araç, kaynak kodunuzu, gizlilik bildirimlerinizi, IPA ikili dosyalarınızı ve App Store Connect meta verilerinizi Apple'ın İnceleme Yönergelerine karşı tarar. Tamamen çevrimdışı çalışır, hesap gerektirmez ve taramayı bir saniyenin altında tamamlar.

Greenlight'ın en güçlü özelliği, dört farklı tarama katmanını paralel olarak çalıştırmasıdır. Meta veri taraması; uygulama adı, sürüm, paket kimliği, simge ve gizlilik politikası gibi bilgileri kontrol eder. Kod taraması; 30'dan fazla kalıbı (eksik ATT izni, sosyal giriş sorunları, yer tutucu metinler) inceler. Gizlilik taraması; PrivacyInfo.xcprivacy dosyasının eksiksizliğini ve gerekli API kullanım bildirimlerini doğrular. IPA taraması ise ikili dosyadaki Info.plist anahtarları, başlangıç storyboard'u ve uygulama boyutu gibi teknik detayları kontrol eder.

2026'da App Store onay süreçleri giderek sıkılaşmış ve reddedilme oranları artmıştır. Greenlight, geliştiricilere resmi incelemeden önce tüm olası reddedilme nedenlerini göstererek zaman ve para kaybını önler. Statik taramanın yanı sıra `greenlight verify` komutuyla, hesap silme, geri ödeme ve Apple ile giriş yap gibi akış bağımlı yönergelerin gerçekten çalıştığını doğrulamak için isteğe bağlı bulut cihaz testi de sunar.

Greenlight, mobil uygulama geliştiricileri için yaygın bir soruna pratik bir çözüm getirmektedir: App Store reddedilmeleri. Açık kaynak yapısı sayesinde topluluk tarafından sürekli güncellenen tarama kuralları, Apple'ın yeni yönergelerine hızla uyum sağlar. Homebrew ile kolayca kurulabilen bu araç, 2026'da iOS geliştiricileri için standart bir ön kontrol aracı haline gelme yolunda hızla ilerlemektedir.
