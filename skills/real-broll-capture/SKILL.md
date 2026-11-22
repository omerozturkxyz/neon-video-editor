---
name: real-broll-capture
description: Capture real primary web sources (2× Retina articles, docs, repos) and record live vertical (9:16) or horizontal (16:9) website screen recordings with an animated macOS cursor, smooth scroll choreography, and automatic cookie-banner dismissal — producing HyperFrames-ready 30 fps CFR bt709 MP4s and PNGs with a verified SOURCES.md ledger. Use whenever a video script mentions real sources, articles, documentation, GitHub repos, or website screen recordings ("gerçek kaynaklar", "ekran kayıtları", "screen recording of the site", "real B-roll").
---

# Real B-Roll & Live Screen-Recording Capture (`real-broll-capture`)

Never fake a website screenshot or mock up a source article in CSS when the real webpage exists on the live web. This skill captures **real primary web sources** and **real live scrolling website screen recordings** directly from headless Chrome/Chromium and encodes them into fast-seeking, broadcast-safe assets ready for HyperFrames (`<video>` / `<img>`).

## 3-Tier Real B-Roll Hierarchy

When planning B-roll for any phrase in a talking-head or explainer video, always resolve visuals in this strict priority order:

1. **Tier 1 — Real Primary Source (`--mode source`):**
   - Official documentation, research papers, news articles, GitHub repositories, release blogs.
   - Captured live at `2×` Retina DPR (`540×960 @ 2x` → crisp `1080×1920` for 9:16 vertical, or `960×540 @ 2x` → `1920×1080` for 16:9).
   - Automatic cookie-banner / newsletter-modal dismissal before capture.
   - Logged in `SOURCES.md` with exact URL, capture timestamp, and asset filename.

2. **Tier 2 — Live Interactive Website Screen Recording (`--mode record`):**
   - Real website rendered live in headless Chrome at target viewport (`540×960 @ 2x` = `1080×1920`), scrolling smoothly with cubic ease-in-out while a crisp injected macOS arrow cursor glides across real page elements, triggers real `:hover` states, and performs deliberate click ripples.
   - Deterministic frame-by-frame capture piped directly into FFmpeg (`libx264`, `yuv420p`, `bt709`, `30 fps CFR`, `-g 15 -keyint_min 15 -bf 0 -movflags +faststart`) so HyperFrames parallel workers scrub it with near-zero decode latency.

3. **Tier 3 — Bespoke Generated Scene (When Nothing Real Exists):**
   - Only when illustrating an abstract, futuristic, or unfilmable concept.
   - Generate a clean full-bleed 9:16 / 16:9 visual or video (zero text/watermarks), normalize to `30 fps CFR bt709`, and tag on-screen clearly (e.g. `AI SAHNE` / `GENERATED`).

---

## Bundled CLI Tool (`scripts/capture_site.mjs`)

Requires: **Node.js 18+**, **Google Chrome / Chromium**, **`puppeteer-core` or `playwright`** (auto-discovered from local project, global npm, or HyperFrames npx cache), and **FFmpeg**.

### 1. Capture a Real Primary Source (2× Retina PNG)

```bash
node scripts/capture_site.mjs \
  --mode source \
  --url "https://blog.google/technology/google-deepmind/" \
  --out assets/sources/real-source-deepmind.png \
  --width 540 --height 960 --dpr 2 \
  --scroll-to 0 \
  --theme light
```

Flags:
- `--fullpage` — capture a tall scrollable PNG (useful for GSAP `y`-panning inside HyperFrames)
- `--theme light|dark` — force `prefers-color-scheme`
- `--wait 1500` — extra settle delay (ms) after `networkidle2`
- `--hide-selector ".cookie-banner,.modal"` — optional extra CSS selectors to hide

### 2. Record a Live Scrolling Website Screen Recording (30 fps CFR MP4)

```bash
node scripts/capture_site.mjs \
  --mode record \
  --url "https://github.com/heygen-com/hyperframes" \
  --out assets/sources/screen-record-hyperframes.mp4 \
  --width 540 --height 960 --dpr 2 \
  --duration 2.4 --fps 30 \
  --scroll-distance 720 \
  --theme dark \
  --cursor true
```

What `--mode record` does deterministically:
1. Opens the live URL in headless Chrome at `width×height` with `deviceScaleFactor: dpr` (e.g. `540×960 @ 2x` = `1080×1920`).
2. Dismisses common cookie/consent overlays and disables distracting CSS caret blinks.
3. Injects a crisp SVG macOS pointer cursor (`pointer-events: none; z-index: 2147483647`) plus a subtle click ripple ring.
4. Steps frame-by-frame (`i = 0 .. duration * fps - 1`), smoothly advancing scroll (`cubicInOut`) and moving the cursor along a natural Bezier path across visible interactive cards/links (dispatching real `mouse.move` events so native CSS `:hover` highlights activate on real DOM elements!).
5. Encodes all PNG frames via FFmpeg into a fast-seek HyperFrames MP4:
   ```bash
   ffmpeg -y -framerate 30 -i frame_%04d.png \
     -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p \
     -colorspace bt709 -color_trc bt709 -color_primaries bt709 \
     -r 30 -g 15 -keyint_min 15 -sc_threshold 0 -bf 0 \
     -movflags +faststart out.mp4
   ```

---

## HyperFrames Integration Pattern

### Full-Screen 3-Beat B-Roll Sequence (Reference Rhythm)

When narrating *"real sources, screen recordings, and generated scenes"*, give each tier **full-screen (`1080×1920`)** breathing room rather than cramming them into tiny static thumbnails:

1. **Beat 1 — Real Source (`<img>` full-bleed + subtle `1.00 → 1.07` push + tactile highlighter sweep + crisp `SOURCE` URL pill)**
2. **Beat 2 — Live Screen Recording (`<video class="clip" data-start="..." data-duration="..." muted playsinline>` full-bleed + crisp `SCREEN RECORDING` pill)**
3. **Beat 3 — Generated Scene (`<img>` or `<video>` full-bleed + slow dolly + crisp `AI SCENE` pill)**

Keep captions in the lower safe band (`y: 1580px` on 1080×1920) with high contrast (`#121212` pill, `#F2F2F2` text) so captions never collide with the page header or cursor focus.

## Provenance Ledger (`SOURCES.md`)

Always record every captured source in the project's `SOURCES.md`:

```markdown
| Asset | Tier | Source URL | Captured | Notes |
| --- | --- | --- | --- | --- |
| `assets/sources/real-source.png` | Real Source (2× PNG) | `https://...` | `YYYY-MM-DD` | Light mode, cookie bar dismissed |
| `assets/sources/screen-record.mp4` | Live Screen Recording (30fps MP4) | `https://...` | `YYYY-MM-DD` | Dark mode, live scroll + cursor hover |
```

## Visual QC Checklist (Mandatory)

After capturing, inspect the PNG / extracted frames from the MP4 directly before rendering:
- Zero cookie banners, login walls, CAPTCHA blocks, or broken font fallbacks.
- Crisp Retina typography legible on a phone screen.
- Smooth cursor path staying inside safe margins (`x: 120..960`, `y: 260..1450`).
- MP4 verified via `ffprobe`: `1080×1920`, `30/1` CFR, `yuv420p`, `bt709`, `faststart`.
