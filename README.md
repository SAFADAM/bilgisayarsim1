# SimPC / CyberOS - Telefondan Oynanabilen Bilgisayar Simülasyonu

Telefonların dokunmatik ekranları, Android APK ortamı ve modern web tarayıcıları için özel olarak tasarlanmış, zengin özellikli **Sanal Bilgisayar ve PC Toplama/Geliştirme Simülatörü**.

---

## 📦 GitHub Üzerinden Otomatik Android APK Çevirme (.apk)

Projede otomatik derleme için `.github/workflows/build.yml` ve `capacitor.config.json` dosyaları hazırlandı. 

### APK'yı GitHub'dan Almak İçin Adımlar:
1. Bu proje klasörünü kendi **GitHub** hesabınızda yeni bir depoya (repository) yükleyin (push edin).
2. GitHub'daki deponuzda **Actions** sekmesine gidin.
3. **Build Android APK** iş akışının otomatik olarak çalıştığını göreceksiniz.
4. İşlem bittiğinde **Summary (Özet)** sayfasından **`SimPC-Android-APK`** başlıklı `.apk` dosyasını doğrudan indirip telefonunuza yükleyebilirsiniz!

---

## 📱 Telefondan Nasıl Oynanır?

1. **Doğrudan Tarayıcıdan:**
   - Bilgisayarınızdan `index.html` dosyasını açabilir veya yerel ağ üzerinden telefonunuzun tarayıcısından bağlanabilirsiniz.
2. **APK Olarak:**
   - GitHub Actions üzerinden üretilen `.apk` dosyasını telefonunuza kurarak doğrudan uygulama çekmecesinden açabilirsiniz.
3. **Tam Ekran Web Uygulaması:**
   - Telefon tarayıcınızın menüsünden (Chrome veya Safari) **"Ana Ekrana Ekle" (Add to Home Screen)** seçeneğini seçerek tam ekran oynayabilirsiniz.
4. **Dokunmatik Kontroller:**
   - **Pencereleri Sürükleme:** Pencere başlık çubuğuna parmağınızla basılı tutup dilediğiniz yere sürükleyin.
   - **Sanal Mouse / Trackpad (🖱️):** Sağ alttaki fare simgesine dokunarak telefonunuzda sanal bir fare touchpad'i ve imleci açabilirsiniz.
   - **Tam Ekran Modu (⛶):** Sağ alt görev çubuğundaki tam ekran tuşuna basarak tam ekran yapabilirsiniz.

---

## 🎮 Uygulamalar ve Özellikler

### 1. 🌐 SimGoogle & İnternet Tarayıcısı (YENİ!)
- Gerçekçi adres çubuğu ve gezinme butonları (`[◀]`, `[▶]`, `[🔄]`, `[🏠]`).
- **SimGoogle Arama Motoru:** Arama kutusuna dilediğiniz kelimeyi yazıp aratabilirsiniz.
  - Örneğin: *"pacman"*, *"ateş ve su"*, *"rtx 5090"*, *"bitcoin"*, *"hacker"*, vb.
- **Yer İmleri:** 
  - 📺 **VidTube:** Komik teknoloji ve oyun videoları listesi.
  - 📰 **SimHaber:** Son dakika kripto ve teknoloji haberleri.
  - 💡 **WikiBilgi:** Donanım sözlüğü ve rehberler.

### 2. 🎮 Oyun Merkezi (Mini Oyunlar & Benchmark)
- 🟡 **Pac-Man (YENİ!):** Klasik labirentte sarı yemleri toplayın, güç yemini alıp hayaletleri kovalayın! Dokunmatik D-Pad ve ekran kaydırma (Swipe) kontrolleri mevcuttur.
- 🔥💧 **Ateş ve Su (YENİ!):** 
  - Ateş Çocuk kırmızı lavlardan geçer, suya düşerse söner.
  - Su Kız mavi sulardan geçer, lava düşerse yanar. İkisi de yeşil asitten kaçınmalıdır.
  - Elmasları toplayın, kapı lazerini açan butona basın ve çıkış kapılarına ulaşarak $100 ödül kazanın!
  - Mobil buton: `[🔄 Karakter Değiştir: 🔥 / 💧]`.
- 💾 **Flappy Floppy:** Dokunarak disketi zıplatma ve engellerden kaçarak para kazanma.
- 🐍 **Retro Yılan (Snake):** Sanal D-Pad ile klasik yılan oyunu.
- 🚀 **3D Benchmark:** Donanımınıza göre canlı FPS hesaplayan 3D dönen küp testi.

### 3. 🛒 ParçaBurada (PC Donanım Mağazası)
- Eski bir **Celeron** işlemci, **Intel HD** grafik ve **2GB RAM** ile başlayın.
- RTX 5090 CyberTitan, Ryzen 9 9950X, 64GB DDR5 ve 360mm Özel Sıvı Soğutmaya kadar adım adım yükseltin.

### 4. ⚡ SimMiner Pro (Kripto Madenci)
- SimCoin kazın, borsa takibi yapın ve overclock kaydırıcısıyla hızı artırın.

### 5. 💻 Hacker Terminali (CMD)
- `[🔓 Sunucu Hackle]`, `[📡 Ağ Tara]`, `[🌧️ Matrix]`, `[💻 Sistem]`.
- Gizli komutlar: `help`, `hack`, `scan`, `matrix`, `sysinfo`, `clear`, `format c:`, `easteregg`.

### 6. ⏻ Kapatma & Yeniden Başlatma (YENİ!)
- **Kapat:** Bilgisayarı kapatır; APK olarak çalışıyorsa **uygulamadan doğrudan çıkar (exitApp)**! Tarayıcıda ise monitör kapanma efektiyle ekran tamamen kararır ve açmak için ekrandaki fiziksel güç tuşuna dokunmanız gerekir.
- **Yeniden Başlat:** Gerçekçi BIOS POST ekranı çalışır (RAM testi, işlemci tespiti, CyberOS yükleme) ve açılış sesiyle masaüstü yeniden gelir.
