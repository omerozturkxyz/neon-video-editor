# Ana Otonom Video Kurgu Prompt'u (Nötr Şablon)

Ham talking-head videonu (ve varsa harici mikrofon kaydını) proje klasörünün `assets/` dizinine attıktan ve kendi `MEMORY.md` dosyanı doldurduktan sonra aşağıdaki prompt'u AI ajanına doğrudan yapıştır:

---

```markdown
`assets/` klasörüne ham talking-head videomu (ve varsa harici mikrofon kaydımı) yükledim.
Videoda metni birden fazla kez okudum; çekim sırasında bazı cümleleri ufak değiştirmiş olabilirim.

Önce kendi stilimi tanımladığım `MEMORY.md` ve `AGENTS.md` dosyalarını oku, ardından şu 6 adımı baştan sona otonom olarak uygula:

1. **Ses Senkronu & Take Seçimi:**
   - Ayrı harici mikrofon kaydı varsa 1 ms RMS zarf korelasyonuyla kameraya milisaniye hassasiyetinde kilitle.
   - `faster-whisper` ile kelime bazlı zaman damgalarını çıkar; tüm tekrarları inceleyip en enerjik, akıcı ve takılmasız take'leri seç.
   - Hatalı çekimleri ve `> 0.20 sn` boşlukları kes; ham HLG görüntüyü Rec.709 SDR (`30 fps CFR`, hızlı arama için `0.5 sn` keyframe `-g 15 -bf 0`) yap ve agresif `afftdn` kullanmadan temiz stüdyo vokal mastering ile master konuşmacı videosunu üret.
   - Çekim sırasında yaptığım kelime değişikliklerini birebir koru.

2. **Hikâye Planı & 3 Katmanlı Gerçek B-Roll (`STORYBOARD.md` + `SOURCES.md`):**
   - `MEMORY.md` içindeki yerleşim ve stil tercihlerime göre sahne planını çıkar; ardışık iki sahnede asla aynı geçişi tekrarlama (`saas-motion-video` + `variety_audit.py`).
   - Konuşmada geçen gerçek makaleler/dokümanlar için `real-broll-capture` ile `2×` Retina ekran görüntüsü yakala, bahsedilen siteler için canlı kaydırmalı + imleçli dikey `30 fps CFR` ekran kaydı MP4'ü kaydet, yalnızca gerçek görüntü olmayan yerlerde sıfırdan AI/kod sahnesi üret. Tüm kaynakları `SOURCES.md` dosyasına işle.

3. **Kodla Motion Grafikler (`HyperFrames`):**
   - Her sahneyi HTML + CSS + GSAP + Canvas 2D ile kodla; tüm animasyonları ve altyazıları söylediğim gerçek kelimelerin zaman damgalarına milisaniye bazında kilitle.
   - Altyazıların konuşmacı yüzü veya grafiklerle çakışmadığından emin ol; Türkçe büyük harflerde `text-transform: uppercase` kullanma.

4. **Müzik & 3-Kanallı Gerçek SFX:**
   - `MEMORY.md` içindeki müzik tonuma uygun, vokal frekansları oyulmuş bir arka plan müziğini konuşma altına dengeli şekilde yerleştir.
   - Yalnızca gerçek kayıtlı telifsiz/CC0 ses efektlerini (`whoosh`, `pop`, `click`, `shutter` vb.) çakışmasız kanallara hareket karesine kilitli olarak yerleştir (yapay bip kullanma).

5. **Görsel & Teknik Self-QA:**
   - Kritik sahnelerden `hyperframes snapshot` contact-sheet alıp kadrajı, altyazı kontrastını ve sıfır çakışmayı gözle doğrula; gördüğün kusurları düzeltip tekrar kontrol et.
   - `hyperframes check --json` çalıştırıp `0 hata` al.

6. **Final Render & EBU R128 Ses Doğrulaması:**
   - Final `out.mp4` dosyasını render et.
   - `ffmpeg ebur128` ile hem stereo hem mono loudness ölç; stereo `-16.0` ile `-17.0 LUFS` arasında ve true peak `< -4.0 dBFS` olacak şekilde gerekirse `-c:v copy` ile 2-pass `loudnorm` uygula.
   - Final teknik özet ve kontrol zaman damgalarını `REVIEW.md` ve `SOUND.md` içine kaydet.
```
