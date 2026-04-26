#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "══════════════════════════════════════════════"
echo "  🍞 Mio Brand 自动部署流水线"
echo "══════════════════════════════════════════════"

echo ""
echo "Step 1/4 本地构建..."
npm run build >/dev/null 2>&1
echo "   ✓ 构建通过"

echo ""
echo "Step 2/4 Git 自动提交..."
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S') 自动部署"
  echo "   ✓ 已自动提交"
else
  echo "   ✓ 工作区干净"
fi

echo ""
echo "Step 3/4 推送到 GitHub..."
git push origin main
echo "   ✓ 已推送"

echo ""
echo "Step 4/4 部署到阿里云 ECS..."
bash scripts/deploy-ecs.sh

echo ""
echo "══════════════════════════════════════════════"
echo "  🎉 全自动部署完成！"
echo "══════════════════════════════════════════════"
echo ""
echo "  GitHub: https://github.com/fileckie/miobakerybrand"
echo "  官网:   http://8.133.194.58:8888"
echo "  后台:   http://8.133.194.58:8888/admin"
echo ""
