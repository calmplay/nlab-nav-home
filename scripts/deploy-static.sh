#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════════
# deploy-static.sh —— 同步 dist/ 到 0 号机 nginx 静态目录
#
# 用法：
#   npm run deploy:static
#   或直接：
#   bash scripts/deploy-static.sh
#
# 前提：
#   1. 本机已配置 SSH key (~/.ssh/id_ed25519)
#   2. 本地 dist/ 已通过 npm run build 生成
#
# 行为：
#   1. npm run build（生成最新 dist/）
#   2. SSH 到 0 号机创建目标目录
#   3. rsync dist/ → 0 号机 /home/cy/docker_vol/nginx/html/lab-nav/
#   4. 输出远端文件清单
#
# 注意：
#   - 只同步 dist/ 目录下的文件（HTML/CSS/JS/favicon 等）
#   - 不同步 node_modules、src、.git 等源码
#   - 使用 rsync --delete，远端多余文件会被清理
# ══════════════════════════════════════════════════════════════════

set -euo pipefail

# ── 服务器连接信息 ──
SSH_PORT="11040"
SSH_USER="cy"
SSH_HOST="nuist.cfushn.com"
SSH_KEY="$HOME/.ssh/id_ed25519"
REMOTE_DIR="/home/cy/docker_vol/nginx/html/lab-nav"

SSH_OPTS="-p ${SSH_PORT} -i ${SSH_KEY}"

# ── 确保在 nlab-nav-home 根目录执行 ──
if [[ ! -f "package.json" ]] || ! grep -q '"name": "nlab-nav-home"' package.json 2>/dev/null; then
  echo "❌ 请在 nlab-nav-home 项目根目录下执行此脚本"
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 部署 nlab-nav-home 到 0 号机"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. 构建 ──
echo ""
echo "📦 npm run build..."
npm run build

# ── 2. 确认 dist/ 存在 ──
if [[ ! -f "dist/index.html" ]]; then
  echo "❌ dist/index.html 不存在，构建失败"
  exit 1
fi

# ── 3. 创建远端目录 ──
echo ""
echo "📁 确保远端目录存在..."
ssh ${SSH_OPTS} "${SSH_USER}@${SSH_HOST}" "mkdir -p ${REMOTE_DIR}"

# ── 4. rsync 同步 ──
echo ""
echo "📡 rsync dist/ → ${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/"

# 检查 rsync 是否可用
if command -v rsync &>/dev/null; then
  rsync -av --delete \
    -e "ssh ${SSH_OPTS}" \
    dist/ \
    "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/"
else
  echo "⚠️  rsync 不可用，退化为 scp"
  scp -r -P ${SSH_PORT} -i ${SSH_KEY} dist/* "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/"
fi

# ── 5. 输出远端文件清单 ──
echo ""
echo "📋 远端文件清单 (${REMOTE_DIR}/)："
ssh ${SSH_OPTS} "${SSH_USER}@${SSH_HOST}" "ls -laR ${REMOTE_DIR}/"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 部署完成 → http://nuist.cfushn.com:1104/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
