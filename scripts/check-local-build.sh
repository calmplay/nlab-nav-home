#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════════
# check-local-build.sh —— 本地构建检查
#
# 用途：开发者在提交前运行，确认 TypeScript 类型检查和 Vite 构建通过。
# 不修改任何远程文件。
# ══════════════════════════════════════════════════════════════════

set -euo pipefail

# 确保在 nlab-nav-home 根目录执行
if [[ ! -f "package.json" ]] || ! grep -q '"name": "nlab-nav-home"' package.json 2>/dev/null; then
  echo "❌ 请在 nlab-nav-home 项目根目录下执行此脚本"
  exit 1
fi

echo "📦 安装依赖（如已安装则跳过）..."
npm install --silent

echo ""
echo "🔨 TypeScript 类型检查 + Vite 构建..."
npm run build

echo ""
if [[ -f "dist/index.html" ]]; then
  echo "✅ dist/index.html 存在"
else
  echo "❌ dist/index.html 不存在！构建可能失败"
  exit 1
fi

if [[ -d "dist/assets" ]]; then
  echo "✅ dist/assets/ 存在"
else
  echo "❌ dist/assets/ 不存在！构建可能失败"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 本地构建检查全部通过"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
