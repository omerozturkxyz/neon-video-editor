# 13 Açık Kaynak Motion Design & Video Edit Reposu + 26 Skill Kataloğu

Bu liste, kodla otonom video üretim hattında kullanılan tüm açık kaynaklı motorları, topluluk skill'lerini ve hangi sahnede hangisinin devreye girdiğini tek bakışta sunar.

---

## 1. Ana Motorlar (6 Core Skill)

| Repo | İçerdiği Skill'ler | Rol & Katkı |
| --- | --- | --- |
| [**heygen-com/hyperframes**](https://github.com/heygen-com/hyperframes) | `hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`, `reverse-any-video`, `style-sampling` | HTML/CSS/GSAP/Canvas 2D'yi doğrudan MP4'e çeviren ana render motoru, ~450 hazır component/block registry, `check`, `snapshot`, `preview`, `render` ve medya toplama araçları |
| [**kajisho5/ffmpeg-skill**](https://github.com/kajisho5/ffmpeg-skill) | `ffmpeg-skill` | 42 yerel FFmpeg aracı: kesme, birleştirme, reframe, sessizlik temizleme, ses senkronu, HDR→SDR, stereo/mono `ebur128` loudness |
| [**SYSTRAN/faster-whisper**](https://github.com/SYSTRAN/faster-whisper) | `faster-whisper` | Yerel konuşma-metin motoru: milisaniye hassasiyetinde kelime zaman damgaları (`--word-timestamps`), Türkçe yüksek doğruluk |

---

## 2. HyperFrames & Talking-Head Motion Uzantıları (Öncelikli)

| Repo | Kurulan Skill'ler | Rol & Neden Önemli |
| --- | --- | --- |
| [**tugrawork-creator/saas-motion-kit**](https://github.com/tugrawork-creator/saas-motion-kit) | `saas-motion-video` | Doğrudan HyperFrames için anti-slop hareket sistemi: **24 geçiş atlası**, **101 görsel tema**, tone matrix, `variety_audit.py`, `component-forge.md` |
| [**heygen-com/hyperframes-community-skills**](https://github.com/heygen-com/hyperframes-community-skills) | `vox-explainer`, `camera-3d-captions`, `p5-paint-animation`, `duo`, `session-story`, `prod-by-claude` | Resmi HyperFrames topluluk skill'leri: Vox tarzı `12 fps` editoryal anlatım, konuşmacı etrafında 3D kamera altyazıları, el çizimi boyama efektleri, çift ekran telefon formatı |
| [**Barty-Bart/motion-graphics**](https://github.com/Barty-Bart/motion-graphics) | `motion-broll`, `object-separation`, `explainer-high-energy`, `explainer-engaging`, `sound-effects` | Talking-head videolar için doğrudan güç çarpanı: konuşma metnine kilitli kesintisiz B-roll, SAM 2 ile konuşmacıyı arka plandan ayırma, ölçülmüş `-16 LUFS` CC0 ses efekti hattı |
| [**latent-spaces/brag**](https://github.com/latent-spaces/brag) | `brag` | Mevcut kod projesini doğrudan okuyup kısa, paylaşılabilir ürün lansman videosu üreten `/brag` skill'i |

---

## 3. Üst Düzey Motion Craft, Stil Kütüphaneleri & Tersine Mühendislik

| Repo | Kurulan Skill'ler | Rol & Neden Önemli |
| --- | --- | --- |
| [**lemomo-ai/lemo-opuscar**](https://github.com/lemomo-ai/lemo-opuscar) | `lemo-opuscar` | Tamamen kodla üretilen **99 sinematik film stili** (`blueprint`, `bauhaus-shapes`, `dark-documentary`, `archive-lighttable`, `dataviz`, `exploded-teardown` vb.) + `DIRECTOR.md` & `TECHNIQUE.md` |
| [**AbubakrChan/product-launch-motion**](https://github.com/AbubakrChan/product-launch-motion) | `product-launch-motion` | Dribbble seviyesi ürün lansman motion prensipleri: kesintisiz tek şekil dönüşümü (*one shape that never cuts*), kapalı form yay fiziği, hıza göre eğilen imleç, ritme kilitli SFX |
| [**howseen-ai/claude-motion-design**](https://github.com/howseen-ai/claude-motion-design) | `motion-design` | Saf HTML/JS `seek(t)` kodla motion design hattı, Playwright alt-kare render, `tmix` hareket bulanıklığı ve ses efektlerinin ölçülmüş pik karesine oturtulması |
| [**tuzhechen2005/opus-video-skills**](https://github.com/tuzhechen2005/opus-video-skills) | `kinetic-reel`, `painted-animation` | Kinetik tipografi + Three.js showreel üretimi (`kinetic-reel`) ve suluboya + mürekkep el boyaması animasyon (`painted-animation`) |
| [**JuneYaooo/rea-video**](https://github.com/JuneYaooo/rea-video) | `rea-video` | Herhangi bir referans videoyu kare kare (gerçek çekim / AI / 3D / kod) parçalayıp açık **`VIDEO.md`** üretim planına dönüştüren tersine mühendislik aracı |
| [**shadcn-labs/snapcn**](https://github.com/shadcn-labs/snapcn) | `snapcn` | Ürün demoları için terminal simülatörü, AI chat akışı, cihaz çerçevesi ve karaoke altyazı bileşen kataloğu (`MOTION.md` / `DESIGN.md`) |

---

## 4. Hangi İhtiyaçta Hangi Skill Kullanılır?

- **Talking-head videoda üst yarıya zengin editoryal B-roll kurarken:** `vox-explainer` + `motion-broll` + `saas-motion-video`
- **Konuşmacının ARKASINA dev başlık veya 3D kelime halkası koyarken:** `object-separation` + `camera-3d-captions`
- **Tekrar eden geçişlerden kurtulup her sahneyi özgün kılmak için:** `saas-motion-video` (`transition-atlas.md` — 24 geçiş + `variety_audit.py`)
- **Özel sanat yönetimi seçerken (99 film stili):** `lemo-opuscar`
- **Ürün demosu / SaaS lansmanı kliplerinde:** `product-launch-motion` + `brag` + `snapcn` + `motion-design`
- **Ses efektlerini tam çarpma karesine kilitleyip `-16 LUFS` ölçmek için:** `sound-effects` + `ffmpeg-skill`
- **Bir referans videoyu tersine mühendislikle çözüp kendi stiline uyarlamak için:** `rea-video` + `reverse-any-video`
