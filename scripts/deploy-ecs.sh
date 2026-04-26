#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ECS_HOST="${ECS_HOST:-8.133.194.58}"
ECS_USER="${ECS_USER:-root}"
REMOTE_DIR="${REMOTE_DIR:-/opt/miobakerybrand}"
APP_NAME="${APP_NAME:-miobakerybrand}"
APP_PORT="${APP_PORT:-8888}"
PUBLIC_URL="${PUBLIC_URL:-http://${ECS_HOST}:${APP_PORT}}"

ARCHIVE="/tmp/${APP_NAME}-deploy-$(date +%Y%m%d%H%M%S).tgz"
REMOTE_ARCHIVE="/tmp/${APP_NAME}-deploy.tgz"

echo "1/4 本地构建..."
npm run build

echo "2/4 打包..."
tar --exclude="./node_modules" --exclude="./dist" --exclude="./data" --exclude="./.git" -czf "$ARCHIVE" .

echo "3/4 上传..."
scp "$ARCHIVE" "${ECS_USER}@${ECS_HOST}:${REMOTE_ARCHIVE}"

echo "4/4 服务器部署..."
ssh "${ECS_USER}@${ECS_HOST}" "APP_NAME='${APP_NAME}' APP_PORT='${APP_PORT}' REMOTE_DIR='${REMOTE_DIR}' REMOTE_ARCHIVE='${REMOTE_ARCHIVE}' bash -s" <<'REMOTE'
set -euo pipefail
mkdir -p "$REMOTE_DIR"
tar -xzf "$REMOTE_ARCHIVE" -C "$REMOTE_DIR"
cd "$REMOTE_DIR"
docker build -t "$APP_NAME" .
docker rm -f "$APP_NAME" >/dev/null 2>&1 || true
mkdir -p "$REMOTE_DIR/data"
docker run -d \
  --name "$APP_NAME" \
  --restart unless-stopped \
  -p "$APP_PORT:8787" \
  -v "$REMOTE_DIR/data:/app/data" \
  "$APP_NAME"
curl -fsS "http://127.0.0.1:8787/api/sections" >/dev/null
REMOTE

rm -f "$ARCHIVE"
echo "✅ 部署完成: ${PUBLIC_URL}"
