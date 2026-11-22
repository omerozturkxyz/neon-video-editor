#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Gemini Neon — HDR→SDR, Fast-Seek Keyframe & Broadcast EBU R128 Audio Aracı
# Kullanım:
#   ./master-audio.sh sdr   input.MOV output_sdr.mov     # macOS Apple native Rec.709 SDR
#   ./master-audio.sh fast  input.mp4 output_fast.mp4    # HyperFrames için 0.5s keyframe + bt709
#   ./master-audio.sh check out.mp4                      # Stereo & Mono ebur128 ölçümü
#   ./master-audio.sh norm  out.mp4 out_mastered.mp4     # Lossless video (-c:v copy) + 2-pass loudnorm (-16.2 LUFS / -4.2 dBFS)
# ==============================================================================

MODE="${1:-}"
IN="${2:-}"
OUT="${3:-}"

case "$MODE" in
  sdr)
    [ -z "$IN" ] || [ -z "$OUT" ] && echo "Kullanım: $0 sdr input.MOV output_sdr.mov" && exit 1
    echo "✦ Apple native avconvert ile Rec.709 SDR dönüşümü..."
    avconvert --source "$IN" --output "$OUT" --preset Preset1920x1080 --replace
    echo "✅ Hazır: $OUT"
    ;;

  fast)
    [ -z "$IN" ] || [ -z "$OUT" ] && echo "Kullanım: $0 fast input.mp4 output_fast.mp4" && exit 1
    echo "✦ HyperFrames hızlı kare arama (0.5 sn keyframe, sıfır B-frame, Rec.709)..."
    ffmpeg -y -i "$IN" \
      -c:v libx264 -preset fast -crf 17 -r 30 -g 15 -keyint_min 15 -sc_threshold 0 -bf 0 \
      -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
      -movflags +faststart -c:a copy "$OUT"
    echo "✅ Hazır: $OUT"
    ;;

  check)
    [ -z "$IN" ] && echo "Kullanım: $0 check out.mp4" && exit 1
    echo "=== STEREO EBU R128 ==="
    ffmpeg -hide_banner -nostats -i "$IN" -af ebur128=peak=true -f null - 2>&1 | tail -n 14
    echo "=== MONO (0.5L + 0.5R) EBU R128 ==="
    ffmpeg -hide_banner -nostats -i "$IN" -af "pan=mono|c0=0.5*c0+0.5*c1,ebur128=peak=true" -f null - 2>&1 | tail -n 14
    ;;

  norm)
    [ -z "$IN" ] || [ -z "$OUT" ] && echo "Kullanım: $0 norm out.mp4 out_mastered.mp4" && exit 1
    echo "✦ 1. Geçiş: ebur128 ölçümü alınıyor..."
    STATS=$(ffmpeg -hide_banner -i "$IN" -af "loudnorm=I=-16.2:TP=-4.2:LRA=7:print_format=json" -f null - 2>&1)
    echo "✦ 2. Geçiş: Görüntü kopyalanarak (-c:v copy) 256k AAC broadcast master üretiliyor..."
    python3 - "$IN" "$OUT" "$STATS" <<'PY'
import json, re, subprocess, sys
in_path, out_path, stats = sys.argv[1], sys.argv[2], sys.argv[3]
m = re.findall(r'\{[^{}]*"input_i"[^{}]*\}', stats, re.S)
d = json.loads(m[-1])
af = (
    f"loudnorm=I=-16.2:TP=-4.2:LRA=7:"
    f"measured_I={d['input_i']}:measured_LRA={d['input_lra']}:"
    f"measured_TP={d['input_tp']}:measured_thresh={d['input_thresh']}:"
    f"offset={d['target_offset']}:linear=true"
)
subprocess.run([
    "ffmpeg", "-y", "-v", "error", "-i", in_path,
    "-c:v", "copy", "-af", af, "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
    "-movflags", "+faststart", out_path
], check=True)
PY
    echo "✅ Master tamamlandı: $OUT"
    "$0" check "$OUT"
    ;;

  *)
    echo "Kullanım: $0 {sdr|fast|check|norm} <input> [output]"
    exit 1
    ;;
esac
