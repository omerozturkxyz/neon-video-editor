#!/usr/bin/env node
/**
 * real-broll-capture — Deterministic Real Source & Live Website Screen Recording CLI
 *
 * Modes:
 *   --mode source   Capture a 2x Retina PNG of a real primary web source (article, docs, repo)
 *   --mode record   Record a deterministic 30fps CFR MP4 scrolling screen recording with live cursor
 *
 * Zero-bloat dependency resolution:
 *   Auto-discovers Chrome/Chromium + puppeteer-core or playwright from local project,
 *   global node_modules, or npx cache (including HyperFrames' bundled puppeteer-core).
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const require = createRequire(import.meta.url);

function parseArgs(argv) {
  const args = {
    mode: "source",
    url: "",
    out: "",
    width: 540,
    height: 960,
    dpr: 2,
    duration: 2.2,
    fps: 30,
    scrollStart: 0,
    scrollDistance: 680,
    theme: "light",
    wait: 1400,
    fullpage: false,
    cursor: true,
    clickAt: 0.62,
    hideSelector: "",
    cropTop: 0,
  };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    const v = argv[i + 1];
    switch (k) {
      case "--mode": args.mode = v; i++; break;
      case "--url": args.url = v; i++; break;
      case "--out": args.out = v; i++; break;
      case "--width": args.width = Number(v); i++; break;
      case "--height": args.height = Number(v); i++; break;
      case "--dpr": args.dpr = Number(v); i++; break;
      case "--duration": args.duration = Number(v); i++; break;
      case "--fps": args.fps = Number(v); i++; break;
      case "--scroll-start": args.scrollStart = Number(v); i++; break;
      case "--scroll-distance": args.scrollDistance = Number(v); i++; break;
      case "--theme": args.theme = v; i++; break;
      case "--wait": args.wait = Number(v); i++; break;
      case "--fullpage": args.fullpage = true; break;
      case "--cursor": args.cursor = v !== "false"; i++; break;
      case "--click-at": args.clickAt = Number(v); i++; break;
      case "--hide-selector": args.hideSelector = v; i++; break;
      case "--crop-top": args.cropTop = Number(v); i++; break;
      default:
        if (k.startsWith("--")) {
          console.error(`Unknown flag: ${k}`);
          process.exit(1);
        }
    }
  }
  if (!args.url || !args.out) {
    console.error("Usage: node capture_site.mjs --mode <source|record> --url <URL> --out <PATH>");
    process.exit(1);
  }
  return args;
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function loadPuppeteer() {
  const names = ["puppeteer-core", "puppeteer"];
  for (const name of names) {
    try {
      return require(name);
    } catch {}
  }
  // Search npx cache (e.g. HyperFrames installation)
  const npxDir = path.join(os.homedir(), ".npm", "_npx");
  if (fs.existsSync(npxDir)) {
    for (const entry of fs.readdirSync(npxDir)) {
      for (const name of names) {
        const modPath = path.join(npxDir, entry, "node_modules", name);
        if (fs.existsSync(modPath)) {
          return require(modPath);
        }
      }
    }
  }
  throw new Error(
    "puppeteer-core not found. Install locally (`npm i -D puppeteer-core`) or install HyperFrames first."
  );
}

const DISMISS_SCRIPT = (extraSelector) => `(() => {
  const selectors = [
    '[id*="cookie" i]', '[class*="cookie" i]', '[aria-label*="cookie" i]',
    '[id*="consent" i]', '[class*="consent" i]', '[id*="onetrust" i]',
    '[class*="gdpr" i]', '[data-testid*="cookie" i]',
    '.fc-consent-root', '#CybotCookiebotDialog',
    ${extraSelector ? JSON.stringify(extraSelector) : "null"}
  ].filter(Boolean);

  // Try clicking reject/accept buttons inside cookie dialogs first
  const btns = Array.from(document.querySelectorAll('button, a[role="button"]'));
  for (const b of btns) {
    const txt = (b.textContent || "").trim().toLowerCase();
    if (/^(accept all|accept|agree|got it|ok|dismiss|reject all|kabul et|tamam)$/.test(txt)) {
      const parent = b.closest('[id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i], [role="dialog"]');
      if (parent) { try { b.click(); } catch {} }
    }
  }
  for (const sel of selectors) {
    try {
      document.querySelectorAll(sel).forEach((el) => {
        const style = window.getComputedStyle(el);
        if (style.position === "fixed" || style.position === "sticky" || sel === ${JSON.stringify(extraSelector || "__never__")}) {
          el.style.setProperty("display", "none", "important");
        }
      });
    } catch {}
  }
  // Hide scrollbars for clean cinema capture
  const s = document.createElement("style");
  s.textContent = "::-webkit-scrollbar{display:none!important}html,body{scrollbar-width:none!important}";
  document.head.appendChild(s);
})();`;

const CURSOR_INJECT_SCRIPT = `(() => {
  if (document.getElementById("__rbc_cursor")) return;
  const wrap = document.createElement("div");
  wrap.id = "__rbc_cursor";
  wrap.style.cssText = [
    "position:fixed",
    "left:0",
    "top:0",
    "width:34px",
    "height:34px",
    "pointer-events:none",
    "z-index:2147483647",
    "transform:translate3d(-100px,-100px,0)",
    "filter:drop-shadow(0 3px 6px rgba(0,0,0,0.45))",
    "will-change:transform"
  ].join(";");
  wrap.innerHTML = '<svg width="30" height="30" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 2.5L4.5 23.2L9.8 18.2L13.5 25.5L16.8 23.9L13.1 16.6L20.6 16.6L4.5 2.5Z" fill="#FFFFFF" stroke="#121212" stroke-width="2.1" stroke-linejoin="round"/></svg>';

  const ring = document.createElement("div");
  ring.id = "__rbc_ring";
  ring.style.cssText = [
    "position:fixed",
    "left:0",
    "top:0",
    "width:36px",
    "height:36px",
    "margin-left:-18px",
    "margin-top:-18px",
    "border-radius:50%",
    "border:3px solid #FFEA67",
    "background:rgba(255,234,103,0.18)",
    "pointer-events:none",
    "z-index:2147483646",
    "opacity:0",
    "transform:translate3d(-100px,-100px,0) scale(0.4)"
  ].join(";");

  document.documentElement.appendChild(ring);
  document.documentElement.appendChild(wrap);
})();`;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function cubicBezierPt(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return (
    u * u * u * p0 +
    3 * u * u * t * p1 +
    3 * u * t * t * p2 +
    t * t * t * p3
  );
}

async function main() {
  const args = parseArgs(process.argv);
  const chromePath = findChrome();
  if (!chromePath) {
    throw new Error("Chrome/Chromium executable not found. Set CHROME_PATH env var.");
  }
  const puppeteer = loadPuppeteer();
  fs.mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--font-render-hinting=none",
      "--hide-scrollbars",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: args.width,
      height: args.height,
      deviceScaleFactor: args.dpr,
      isMobile: args.width <= 600,
      hasTouch: false,
    });
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: args.theme === "dark" ? "dark" : "light" },
    ]);
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    );

    console.log(`[real-broll-capture] Opening ${args.url} (${args.width}x${args.height} @${args.dpr}x, theme=${args.theme})...`);
    await page.goto(args.url, { waitUntil: "networkidle2", timeout: 45000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, args.wait));
    await page.evaluate(DISMISS_SCRIPT(args.hideSelector));
    await new Promise((r) => setTimeout(r, 350));

    if (args.scrollStart > 0) {
      await page.evaluate((y) => window.scrollTo(0, y), args.scrollStart);
      await new Promise((r) => setTimeout(r, 250));
    }

    if (args.mode === "source") {
      await page.screenshot({
        path: args.out,
        fullPage: args.fullpage,
        type: "png",
      });
      const stat = fs.statSync(args.out);
      console.log(`[real-broll-capture] Saved real source PNG -> ${args.out} (${Math.round(stat.size / 1024)} KB)`);
      return;
    }

    if (args.mode === "record") {
      const totalFrames = Math.max(2, Math.round(args.duration * args.fps));
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "rbc-frames-"));
      try {
        if (args.cursor) {
          await page.evaluate(CURSOR_INJECT_SCRIPT);
        }

        // Measure max scrollable distance so we never hit a dead bottom
        const maxScroll = await page.evaluate(() =>
          Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
        );
        const startY = Math.min(args.scrollStart, maxScroll);
        const dist = Math.min(args.scrollDistance, Math.max(0, maxScroll - startY));

        // Natural diagonal cursor path across interactive cards in the middle band
        const w = args.width;
        const h = args.height;
        const cx0 = w * 0.72, cy0 = h * 0.62;
        const cx1 = w * 0.62, cy1 = h * 0.44;
        const cx2 = w * 0.42, cy2 = h * 0.56;
        const cx3 = w * 0.48, cy3 = h * 0.40;

        console.log(`[real-broll-capture] Recording ${totalFrames} frames (${args.duration}s @ ${args.fps}fps, scroll ${startY} -> ${startY + dist}px)...`);

        for (let f = 0; f < totalFrames; f++) {
          const p = totalFrames === 1 ? 1 : f / (totalFrames - 1);
          const scrollP = easeInOutCubic(Math.min(1, Math.max(0, (p - 0.06) / 0.88)));
          const curY = Math.round(startY + dist * scrollP);

          const curX = cubicBezierPt(cx0, cx1, cx2, cx3, easeInOutCubic(p));
          const curPy = cubicBezierPt(cy0, cy1, cy2, cy3, easeInOutCubic(p));

          // Click pulse window around clickAt
          const dt = p - args.clickAt;
          const clicking = dt >= 0 && dt <= 0.14;
          const clickP = clicking ? dt / 0.14 : 0;

          await page.evaluate(
            ({ y, x, py, showCursor, clicking, clickP }) => {
              window.scrollTo({ top: y, left: 0, behavior: "instant" });
              if (showCursor) {
                const c = document.getElementById("__rbc_cursor");
                const r = document.getElementById("__rbc_ring");
                if (c) {
                  const sc = clicking && clickP < 0.35 ? 0.86 : 1.0;
                  c.style.transform = `translate3d(${x.toFixed(1)}px,${py.toFixed(1)}px,0) scale(${sc})`;
                }
                if (r) {
                  if (clicking) {
                    const rSc = 0.45 + clickP * 1.45;
                    const op = Math.max(0, 1 - clickP);
                    r.style.opacity = op.toFixed(3);
                    r.style.transform = `translate3d(${(x + 4).toFixed(1)}px,${(py + 3).toFixed(1)}px,0) scale(${rSc.toFixed(3)})`;
                  } else {
                    r.style.opacity = "0";
                  }
                }
              }
            },
            { y: curY, x: curX, py: curPy, showCursor: args.cursor, clicking, clickP }
          );

          // Trigger real CSS :hover states under cursor
          if (args.cursor) {
            try { await page.mouse.move(curX, curPy); } catch {}
          }

          const framePath = path.join(tmpDir, `frame_${String(f).padStart(4, "0")}.png`);
          await page.screenshot({ path: framePath, type: "png" });
        }

        // Encode deterministic fast-seek HyperFrames MP4 (bt709, 30fps CFR, 0.5s keyframe, 0 B-frames)
        execFileSync(
          "ffmpeg",
          [
            "-y", "-hide_banner", "-loglevel", "error",
            "-framerate", String(args.fps),
            "-i", path.join(tmpDir, "frame_%04d.png"),
            "-c:v", "libx264", "-preset", "slow", "-crf", "17",
            "-pix_fmt", "yuv420p",
            "-colorspace", "bt709", "-color_trc", "bt709", "-color_primaries", "bt709",
            "-r", String(args.fps),
            "-g", String(Math.round(args.fps / 2)),
            "-keyint_min", String(Math.round(args.fps / 2)),
            "-sc_threshold", "0", "-bf", "0",
            "-movflags", "+faststart",
            args.out,
          ],
          { stdio: "inherit" }
        );
        const stat = fs.statSync(args.out);
        console.log(`[real-broll-capture] Encoded fast-seek MP4 -> ${args.out} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
      return;
    }

    throw new Error(`Unsupported --mode: ${args.mode}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("[real-broll-capture] ERROR:", err.message || err);
  process.exit(1);
});
