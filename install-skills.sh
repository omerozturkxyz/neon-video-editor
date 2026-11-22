#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Gemini Neon Video Edit Sistemi — 10 Açık Kaynak Motion Reposu + 20 Skill Kurucu
# Kullanım:
#   ./install-skills.sh            -> .agents/skills/ altına bağlar (Antigravity / Codex / Gemini)
#   ./install-skills.sh --claude   -> hem .agents/skills/ hem .claude/skills/ altına bağlar
#   ./install-skills.sh --update   -> kurulu repoları git pull --ff-only ile günceller
# ==============================================================================

LINK_CLAUDE=false
UPDATE_ONLY=false

for arg in "$@"; do
  case "$arg" in
    --claude) LINK_CLAUDE=true ;;
    --update) UPDATE_ONLY=true ;;
    *) echo "Bilinmeyen parametre: $arg" && exit 1 ;;
  esac
done

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RES_DIR="$ROOT_DIR/motion-resources"
AGENTS_SKILLS_DIR="$ROOT_DIR/.agents/skills"
CLAUDE_SKILLS_DIR="$ROOT_DIR/.claude/skills"

mkdir -p "$RES_DIR" "$AGENTS_SKILLS_DIR"
if [ "$LINK_CLAUDE" = true ]; then
  mkdir -p "$CLAUDE_SKILLS_DIR"
fi

echo "✦ Gemini Neon Video Edit Sistemi — Skill Kurulumu Başlıyor"
echo "  Hedef klasör: $ROOT_DIR"
echo ""

# Ön gereksinim kontrolü
for cmd in git node ffmpeg python3; do
  if command -v "$cmd" >/dev/null 2>&1; then
    echo "  ✓ $cmd bulundu"
  else
    echo "  ! $cmd bulunamadı (kurmanız önerilir)"
  fi
done
echo ""

clone_or_update() {
  local name="$1"
  local url="$2"
  local target="$RES_DIR/$name"

  if [ -d "$target/.git" ]; then
    echo "↻ Güncelleniyor: $name"
    git -C "$target" pull --ff-only --quiet || echo "  ! $name güncellenirken atlandı"
  elif [ "$UPDATE_ONLY" = false ]; then
    echo "↓ Klonlanıyor (shallow): $name"
    git clone --depth 1 --quiet "$url" "$target"
  fi
}

# 10 Açık Kaynak Motion & Video Skill Reposu
clone_or_update "saas-motion-kit"              "https://github.com/tugrawork-creator/saas-motion-kit.git"
clone_or_update "hyperframes-community-skills" "https://github.com/heygen-com/hyperframes-community-skills.git"
clone_or_update "motion-graphics"              "https://github.com/Barty-Bart/motion-graphics.git"
clone_or_update "brag"                         "https://github.com/latent-spaces/brag.git"
clone_or_update "lemo-opuscar"                 "https://github.com/lemomo-ai/lemo-opuscar.git"
clone_or_update "product-launch-motion"        "https://github.com/AbubakrChan/product-launch-motion.git"
clone_or_update "claude-motion-design"         "https://github.com/howseen-ai/claude-motion-design.git"
clone_or_update "opus-video-skills"            "https://github.com/tuzhechen2005/opus-video-skills.git"
clone_or_update "rea-video"                    "https://github.com/JuneYaooo/rea-video.git"
clone_or_update "snapcn"                       "https://github.com/shadcn-labs/snapcn.git"

link_skill() {
  local skill_name="$1"
  local rel_source="$2"
  local abs_source="$RES_DIR/$rel_source"

  if [ ! -f "$abs_source/SKILL.md" ]; then
    echo "  ! SKILL.md bulunamadı, atlandı: $skill_name ($rel_source)"
    return
  fi

  ln -sfn "../../motion-resources/$rel_source" "$AGENTS_SKILLS_DIR/$skill_name"
  if [ "$LINK_CLAUDE" = true ]; then
    ln -sfn "../../motion-resources/$rel_source" "$CLAUDE_SKILLS_DIR/$skill_name"
  fi
  echo "  ✓ Skill bağlandı: $skill_name"
}

echo ""
echo "🔗 20 Workspace Skill'i bağlanıyor..."

link_skill "saas-motion-video"     "saas-motion-kit/.claude/skills/saas-motion-video"
link_skill "vox-explainer"         "hyperframes-community-skills/skills/vox-explainer"
link_skill "camera-3d-captions"    "hyperframes-community-skills/skills/camera-3d-captions"
link_skill "p5-paint-animation"    "hyperframes-community-skills/skills/p5-paint-animation"
link_skill "duo"                   "hyperframes-community-skills/skills/duo"
link_skill "session-story"         "hyperframes-community-skills/skills/session-story"
link_skill "prod-by-claude"        "hyperframes-community-skills/skills/prod-by-claude"
link_skill "motion-broll"          "motion-graphics/skills/motion-broll"
link_skill "object-separation"     "motion-graphics/skills/object-separation"
link_skill "explainer-high-energy" "motion-graphics/skills/explainer-high-energy"
link_skill "explainer-engaging"    "motion-graphics/skills/explainer-engaging"
link_skill "sound-effects"         "motion-graphics/skills/sound-effects"
link_skill "brag"                  "brag/skills/brag"
link_skill "lemo-opuscar"          "lemo-opuscar/plugin/skills/lemo-opuscar"
link_skill "product-launch-motion" "product-launch-motion"
link_skill "motion-design"         "claude-motion-design/skill/motion-design"
link_skill "kinetic-reel"          "opus-video-skills/skills/kinetic-reel"
link_skill "painted-animation"     "opus-video-skills/skills/painted-animation"
link_skill "rea-video"             "rea-video/skills/rea-video"
link_skill "snapcn"                "snapcn/skills/snapcn"

echo ""
echo "✅ Tamamlandı! 20 skill .agents/skills/ altına bağlandı."
if [ "$LINK_CLAUDE" = true ]; then
  echo "✅ Ayrıca .claude/skills/ altına da bağlandı."
fi
echo ""
echo "Sonraki adımlar:"
echo "  1. templates/AGENTS.md ve templates/MEMORY.md dosyalarını kendi markana göre düzenleyip proje köküne kopyala."
echo "  2. Ana motorları kur: https://github.com/heygen-com/hyperframes ve https://github.com/kajisho5/ffmpeg-skill"
echo "  3. templates/prompts/neon-edit-prompt.md içindeki ana prompt'u AI ajanına vererek ilk videonu üret!"
