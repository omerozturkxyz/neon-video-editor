# Video Workspace Guide (Starter Template — `neon-video-editor`)

> Bu dosyayı kendi video proje klasörünün kök dizinine `AGENTS.md` (veya Claude Code için `CLAUDE.md`) olarak kopyala. Ajan her yeni oturumda bu teknik çalışma kurallarını otomatik okur.

## Kalıcı Kurgu & Kalite Kuralları
- Her yeni videoya başlamadan önce mutlaka proje kökündeki [MEMORY.md](./MEMORY.md) dosyasını oku ve orada tanımlı renk, font, ekran yerleşimi ve ses tercihlerine uy.
- **Numaralı Klasör Düzeni:** Kısa videoları 3 haneli sırayla tut (`001-ilk-video`, `002-ikinci-video`, …).
- **Türkçe Tipografi Kuralı:** CSS `text-transform: uppercase` Türkçe `i → I` hatası ürettiği için büyük harfli Türkçe başlıkları daima doğrudan doğru harflerle (`İ`, `Ş`, `Ğ`, `Ü`, `Ö`, `Ç`) yaz.
- **Gerçek Kaynak & Ekran Kaydı Kuralı:** Scriptte gerçek bir makale, doküman veya web sitesi geçtiğinde uydurma CSS maket kurma; `real-broll-capture` (`skills/real-broll-capture/scripts/capture_site.mjs`) veya `playwright-recording` ile gerçek `2×` kaynak görseli / canlı kaydırmalı + imleçli `30 fps CFR` ekran kaydı MP4'ü yakala ve `SOURCES.md` içine kaydet.
- **Video & Senkron Hattı:** 4K HLG `.MOV` ham kayıtlarını Rec.709 SDR + `30 fps CFR` + `0.5 sn` keyframe (`-g 15 -bf 0`) formatına çevir; ayrı mikrofon kaydı varsa `1 ms` RMS zarf korelasyonuyla sıfır kare kaymayla senkronla.
- **Ses & Loudness Kuralı:** Temiz mikrofon kayıtlarına agresif `afftdn` uygulama; yapay sentetik bip SFX kullanma; final MP4'ü mutlaka `ffmpeg ebur128` ile stereo ve mono olarak ölç (`-16.0` ile `-17.5 LUFS`, true peak `< -4.0 dBFS`).
- **Görsel Doğrulama:** Render öncesinde `hyperframes snapshot` contact-sheet'lerini gözle kontrol et ve `hyperframes check --json` çıktısında `0 hata` al.

## Kurulu Skill'ler (`.agents/skills/`)
- **Gerçek Kaynak & Ekran Kaydı:** `real-broll-capture`, `playwright-recording`
- **Talking-Head & Editoryal Motion:** `vox-explainer`, `motion-broll`, `object-separation`, `camera-3d-captions`, `explainer-high-energy`, `explainer-engaging`, `sound-effects`
- **Geçiş & Çeşitlilik:** `saas-motion-video` (24 geçiş atlası, `variety_audit.py`)
- **Lansman, Kinetik & Stil:** `product-launch-motion`, `motion-design`, `lemo-opuscar`, `kinetic-reel`, `painted-animation`, `p5-paint-animation`, `brag`, `duo`, `snapcn`
- **Tersine Mühendislik:** `rea-video`, `reverse-any-video`
- **Ana Motorlar:** `hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`, `ffmpeg-skill`, `faster-whisper`
