# Brand & Video Memory Şablonu (Kendi Markana Göre Doldur)

> Bu dosyayı proje köküne `MEMORY.md` olarak kopyala ve `<...>` alanlarını **kendi kanalının/markanın** görsel diline göre doldur. AI ajan ürettiği her videoda senin tanımladığın bu kurallara sadık kalır.

---

## 1. Kanal Kimliği & Format

- **Kanal / Marka Adı:** `<KANAL_ADIN>`
- **Konu Alanı & Ton:** `<ÖRNEK: Teknoloji / Eğitim / Ürün Tanıtımı — sade, doğrudan, enerjik>`
- **Video Formatı:** `9:16` (`1080×1920`, `30 fps CFR`, Rec.709 SDR) *(veya yatay için `16:9` `1920×1080`)*
- **Konuşma Hızı & Kesim:** `<ÖRNEK: 1.05×–1.10× hız, > 0.20 sn boşlukları ve hatalı tekrarları kes>`
- **Ekran Yerleşimi Tercihi:**
  - `<ÖRNEK: Split ekran (üstte grafik, altta konuşmacı) + tam ekran görsel/demo sahneleri + vurgulu anlarda tam ekran kamera>`

---

## 2. Kendi Renk Paletin

- **Açık Zemin / Koyu Zemin:** `<ANA_ARKA_PLAN_HEX>` / `<KOYU_ARKA_PLAN_HEX>`
- **Ana Metin Rengi:** `<METİN_RENGİ_HEX>`
- **İkincil / Açıklama Metni:** `<İKİNCİL_METİN_HEX>`
- **Ana Vurgu Rengi:** `<VURGU_RENGİ_HEX>`
- **Kontrast Kuralı:** Metin ile zemin arasında yüksek okunabilirlik (WCAG AA+) korunur.

---

## 3. Tipografi & Altyazı Stili

- **Başlık Fontu:** `<BAŞLIK_FONTUN>` *(ör. Plus Jakarta Sans, Space Grotesk, Geist, Inter)*
- **Vurgu / İkincil Font:** `<VURGU_FONTUN>`
- **Kod / Sayı Fontu:** `<MONO_FONTUN>` *(ör. JetBrains Mono, Fira Code, tabular-nums)*
- **Altyazı Tercihi:** `<KONUM, BOYUT VE KAPSÜL STİLİN — yüz ve grafiklerle çakışmayacak şekilde>`
- **Türkçe Kuralı:** CSS `text-transform: uppercase` kullanma; büyük harfleri doğrudan `İ, Ş, Ğ, Ü, Ö, Ç` olarak yaz.

---

## 4. Görsel & Hareket Tercihlerin

- **Görsel Tarz:** `<KENDİ STİLİN — ör. minimal editoryal, teknik blueprint, yüksek enerjili kinetik, temiz SaaS arayüzü>`
- **Geçiş Çeşitliliği:** Ardışık iki sahnede aynı geçişi tekrarlama (`saas-motion-video` geçiş atlası ve `variety_audit.py` ile doğrula).
- **Görsel Kalite:** Boş 0. kare (*blank Frame 0*) olmasın; her cümlede sahneyi destekleyen gerçek görsel veya kodlu animasyon kullanılsın.

---

## 5. Müzik, SFX & Yayın Ses Standardı

- **Arka Plan Müziği Tarzı:** `<MÜZİK_TARZIN — ör. sakin lo-fi, ambient elektronik, modern synth>` (vokal frekansları `1200–2800 Hz` civarında oyulmuş, konuşma altında dengeli).
- **Ses Efektleri:** Yalnızca gerçek kayıtlı CC0 / telifsiz foley SFX (`whoosh`, `pop`, `click`, `shutter`) — yapay sentetik bip yasak.
- **Vokal İşleme:** Temiz mikrofon kaydına agresif gürültü giderme (`afftdn`) uygulama; doğal EQ + dengeli kompresör kullan.
- **Final Ölçüm Hedefi:** `ffmpeg ebur128` ile stereo `-16.0` ile `-17.0 LUFS`, true peak `< -4.0 dBFS`.
