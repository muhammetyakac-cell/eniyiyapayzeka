TITLE: Peerd: Tarayıcıda Çalışan İlk Yapay Zeka Ajan Motoru
DATE: 2026-07-01
TAGS: peerd, yapay-zeka, ai-ajan, tarayici-eklentisi, acik-kaynak
---
Peerd, tarayıcınızın içinde çalışan ilk AI ajan motoru. Bir Chrome/Firefox eklentisi olarak çalışan Peerd, ajan döngüsünü doğrudan tarayıcınızda yürütüyor; sekmelerinizi yönetiyor, sanal makineler başlatıyor ve oluşturduklarını eşler arası (peer-to-peer) paylaşıyor. Kendi API anahtarınızı getiriyorsunuz, arka uç yok, telemetri yok. Tamamen gizlilik odaklı.

Peerd'in en etkileyici özelliği, tarayıcı içinde dört farklı sanal alan (sandbox) türü sunması: WebVM (WASM Linux), etkileşimli not defteri, istemci taraflı uygulamalar ve başsız çalışan işlemci. Ajan, göreve en uygun olanı seçiyor. Örneğin hızlı bir hesaplama için başsız işlemciyi kullanırken, görsel bir demo için WebVM'i başlatabiliyor. Tüm bu işlemler tarayıcı sekmeleri olarak görünüyor ve tarayıcı yeniden başlatıldığında bile korunuyor.

Peerd'in güvenlik modeli, tarayıcının yerleşik korumaları üzerine inşa edilmiş. V8 izolatları, WebCrypto şifreleme, WebAuthn ile kilit açma ve opak-orijin iframe'ler kullanılıyor. API anahtarlarınız şifrelenmiş bir kasada saklanıyor ve yalnızca ilgili sağlayıcıya gönderiliyor. Ajan, ham sayfayı asla doğrudan okumuyor; anahtarsız ve ağ bağlantısız bir çalıştırıcı bunu yapıyor. Her eylem, canlı sayfada doğrulanıyor.

Halen 0.x beta sürümünde olan Peerd, Apache 2.0 lisansıyla açık kaynak olarak yayınlandı. Chromium tabanlı tarayıcılar (Chrome, Edge, Brave, Arc) ve Firefox ile uyumlu. Anthropic veya OpenRouter API anahtarıyla ya da tamamen yerel Ollama ile çalışabiliyor. Kurulum gerektirmiyor: extension klasörünü doğrudan tarayıcıya yüklüyorsunuz. AI ajanlarını bulutta değil, kendi tarayıcınızda çalıştırmak isteyenler için 2026'nın en yenilikçi araçlarından biri.
