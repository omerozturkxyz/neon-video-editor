# ✦ Neon Video Editor — Kodla Otonom Video Edit Sistemi

Premiere Pro veya After Effects açmadan; ham talking-head kaydını (`MOV/MP4`) ve varsa harici mikrofon sesini verip:

1. **Ses Senkronu & HDR→SDR:** 4K HLG görüntüyü Rec.709 SDR'ye çevirme ve harici mikrofonu `1 ms` RMS zarf korelasyonuyla kameraya kilitleme
2. **Kelime Bazlı Transkript & Kesim:** `faster-whisper` ile milisaniye bazlı kelime saatleri çıkarma, çoklu çekimden en iyi tekrarları seçme, hatalı çekimleri ve `> 0.20 sn` boşlukları kesme
3. **Hikâye Planı & 3 Katmanlı Gerçek B-Roll:** Sahne akışını planlama (`variety_audit.py`), **gerçek web kaynaklarını** `2×` Retina yakalama, bahsedilen sitelerin **canlı kaydırmalı + imleçli ekran kayıtlarını** (`30 fps CFR MP4`) çekme (`real-broll-capture` & `playwright-recording`) ve gerçek görüntü olmayan yerde sıfırdan AI sahne üretme
4. **Kodla Motion Grafikler:** Tamamen **HTML + CSS + GSAP + Canvas 2D** ile konuşulan kelimeye kilitli animasyonlar ve dinamik altyazılar (`HyperFrames`)
5. **Müzik & Gerçek SFX:** Vokal frekansları oyulmuş arka plan müziği otomasyonu (`ducking`) + hareket karesine kilitli gerçek kayıtlı CC0/Mixkit ses efektleri
6. **Otomatik Self-QA:** `hyperframes check`, görsel kare taraması (*contact sheet*) ve stereo/mono **`-16 LUFS` / `< -4 dBFS`** `ffmpeg ebur128` ses doğrulaması

sisteminin nasıl kurulduğunu, hangi açık kaynak araçları ve skill'leri kullandığını ve kendi bilgisayarında kendi marka stilinle nasıl çalıştıracağını gösteren açık kaynaklı başlangıç deposudur.

---

## ⚡ 3 Dakikada Hızlı Kurulum

```bash
# 1. Repoyu klonla ve klasöre gir
git clone <BU_REPONUN_URLSI>
cd neon-video-editor

# 2. 11 açık kaynak motion & capture reposunu hafif shallow-clone ile çek + 22 skill'i bağla
chmod +x install-skills.sh
./install-skills.sh

# (Claude Code kullanıyorsan .claude/skills/ altına da bağlamak için:)
./install-skills.sh --claude

# 3. Ana motorları doğrula (HyperFrames + FFmpeg)
npx hyperframes --version
brew install ffmpeg   # macOS (Linux: sudo apt install ffmpeg)
```

---

## 🎥 Dahili `real-broll-capture` Skill'i (Gerçek Kaynak & Canlı Ekran Kaydı)

Uydurma CSS site maketleri yerine, bahsedilen gerçek siteleri ve birincil kaynakları doğrudan headless Chrome ile yakalayıp HyperFrames'e hazır `30 fps CFR bt709` dosyalara dönüştürür (`skills/real-broll-capture/`):

```bash
# 1. Gerçek birincil kaynak / makale / doküman yakala (2× Retina PNG, çerez banner'ı otomatik gizlenir)
node skills/real-broll-capture/scripts/capture_site.mjs \
  --mode source \
  --url "https://blog.google/technology/google-deepmind/" \
  --out assets/sources/real-source.png \
  --width 540 --height 960 --dpr 2 --theme light

# 2. Bahsedilen sitenin canlı kaydırmalı + macOS imleçli dikey ekran kaydını çek (30 fps CFR MP4)
node skills/real-broll-capture/scripts/capture_site.mjs \
  --mode record \
  --url "https://github.com/heygen-com/hyperframes" \
  --out assets/sources/screen-record.mp4 \
  --width 540 --height 960 --dpr 2 --duration 2.0 --fps 30 --scroll-distance 600 --theme dark
```

---

## 🎬 6 Adımlı Otonom Video Kurgu Mimarisi

| Adım | Ne Yapar? | Kullandığı Motor / Skill |
| --- | --- | --- |
| **00 · Ham Girdi & Senkron** | 4K HLG `.MOV` → Rec.709 SDR (`avconvert`) + harici mikrofon `1 ms` RMS zarf senkronu + hızlı arama için `0.5 sn` keyframe (`-g 15 -bf 0`) | `ffmpeg-skill` + `templates/scripts/master-audio.sh` |
| **01 · Transkript & Kesim** | Kelime bazlı zaman damgası, çoklu çekimden en iyi take seçimi, hatalı çekim & `> 0.20 sn` boşluk kesimi | `faster-whisper` + `ffmpeg-skill` |
| **02 · Storyboard & Gerçek B-Roll** | Sahne planı, `0` ardışık tekrar geçiş denetimi, gerçek web kaynakları, canlı kaydırmalı + imleçli site ekran kayıtları ve sıfırdan sahneler | `real-broll-capture` + `playwright-recording` + `saas-motion-video` + `vox-explainer` + `motion-broll` |
| **03 · Kodla Motion Grafik** | HTML/GSAP/Canvas 2D ile kendi `MEMORY.md` renk/fontlarına göre konuşulan kelimeye kilitli motion grafikler ve altyazılar | `hyperframes` + `hyperframes-registry` + `product-launch-motion` |
| **04 · Müzik & Gerçek SFX** | Vokal oyulmuş arka plan müziği (`1200/2800 Hz` oyma) + 3 çakışmasız kanalda gerçek foley SFX (sıfır yapay bip) | `sound-effects` + `media-use` |
| **05 · Otomatik Self-QA** | `hyperframes check` (`lint/runtime/layout/craft/audio`), contact-sheet görsel kontrol, stereo & mono `ffmpeg ebur128` (`-16 LUFS`, `< -4 dBFS`) | `hyperframes-cli` + `ffmpeg-skill` |

---

## 📦 Depo Yapısı

```text
neon-video-editor/
├── README.md                              # Sistem özeti ve hızlı başlangıç
├── RESOURCES.md                           # 14 açık kaynak repo & 28 skill tam kataloğu
├── install-skills.sh                      # Tek komutla 11 repo + 22 skill kurucu
├── skills/
│   └── real-broll-capture/
│       ├── SKILL.md                       # Gerçek kaynak & canlı site ekran kaydı skill'i
│       └── scripts/
│           └── capture_site.mjs           # Headless Chrome 2× PNG + 30fps imleçli MP4 kayıt CLI
├── templates/
│   ├── AGENTS.md                          # AI ajan çalışma alanı teknik kurallar şablonu
│   ├── MEMORY.md                          # Kendi marka renk/font/stilini gireceğin boş hafıza şablonu
│   ├── prompts/
│   │   └── neon-edit-prompt.md            # Ham videoyu baştan sona editleyen nötr master prompt
│   └── scripts/
│       └── master-audio.sh                # Rec.709 SDR dönüşüm + 0.5s keyframe + ebur128 & 2-pass loudnorm aracı
└── docs/
    └── index.html                         # İnteraktif rehber & kopyala-yapıştır skill kataloğu
```

---

## 🧩 Kullanılan 14 Açık Kaynak Repo & 28 Skill

Detaylı senaryo eşleştirmesi ve doğrudan bağlantılar için [RESOURCES.md](./RESOURCES.md) dosyasına göz atabilirsin:

- **Ana Motorlar (Global):** [`heygen-com/hyperframes`](https://github.com/heygen-com/hyperframes) · [`kajisho5/ffmpeg-skill`](https://github.com/kajisho5/ffmpeg-skill) · [`SYSTRAN/faster-whisper`](https://github.com/SYSTRAN/faster-whisper)
- **Gerçek Kaynak & Canlı Ekran Kaydı:** Dahili [`skills/real-broll-capture`](./skills/real-broll-capture/SKILL.md) · [`digitalsamba/claude-code-video-toolkit`](https://github.com/digitalsamba/claude-code-video-toolkit) (`playwright-recording`)
- **Talking-Head, B-Roll & Editoryal Motion:** [`tugrawork-creator/saas-motion-kit`](https://github.com/tugrawork-creator/saas-motion-kit) · [`heygen-com/hyperframes-community-skills`](https://github.com/heygen-com/hyperframes-community-skills) · [`Barty-Bart/motion-graphics`](https://github.com/Barty-Bart/motion-graphics) · [`latent-spaces/brag`](https://github.com/latent-spaces/brag)
- **Stil Kütüphaneleri, Lansman Craft & Tersine Mühendislik:** [`lemomo-ai/lemo-opuscar`](https://github.com/lemomo-ai/lemo-opuscar) · [`AbubakrChan/product-launch-motion`](https://github.com/AbubakrChan/product-launch-motion) · [`howseen-ai/claude-motion-design`](https://github.com/howseen-ai/claude-motion-design) · [`tuzhechen2005/opus-video-skills`](https://github.com/tuzhechen2005/opus-video-skills) · [`JuneYaooo/rea-video`](https://github.com/JuneYaooo/rea-video) · [`shadcn-labs/snapcn`](https://github.com/shadcn-labs/snapcn)

---

> Bu depodaki şablonlar, dahili skill'ler, scriptler ve rehber **MIT Lisansı** ile paylaşılmıştır. Bağlantı verilen açık kaynaklı üçüncü parti repolar kendi lisanslarına tabidir.
