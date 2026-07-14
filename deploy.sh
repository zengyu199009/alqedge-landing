#!/bin/bash
# ============================================================
# Deploy alqedge-landing to Cloudflare Pages
# 
# 使用方法:
#   1. 设置环境变量 CLOUDFLARE_API_TOKEN
#   2. 运行: ./deploy.sh
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================="
echo "alqedge-landing 部署脚本"
echo "========================================="
echo ""

# 检查 CLOUDFLARE_API_TOKEN
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "❌ 错误: 需要设置 CLOUDFLARE_API_TOKEN 环境变量"
  echo "   获取方式: Cloudflare Dashboard → My Profile → API Tokens"
  echo ""
  echo "   运行: export CLOUDFLARE_API_TOKEN=your_token_here"
  exit 1
fi

echo "✅ CLOUDFLARE_API_TOKEN 已设置"

# 检查 CLOUDFLARE_ACCOUNT_ID
if [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
  echo "⚠️  CLOUDFLARE_ACCOUNT_ID 未设置，尝试从 API 获取..."
  ACCOUNT_ID=$(curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    "https://api.cloudflare.com/client/v4/accounts" | \
    python3 -c "import sys,json; d=json.load(sys.stdin); print(d['result'][0]['id'])")
  export CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID"
  echo "✅ 自动获取 Account ID: $ACCOUNT_ID"
fi

echo ""

# 步骤 1: 安装依赖
echo "📦 步骤 1/4: 安装依赖..."
npm install --legacy-peer-deps
echo ""

# 步骤 2: OpenNext 构建
echo "🔨 步骤 2/4: OpenNext 构建..."
npx opennextjs-cloudflare build
echo ""

# 步骤 3: 部署到 Cloudflare Workers
echo "🚀 步骤 3/4: 部署到 Cloudflare Workers..."
npx opennextjs-cloudflare deploy
echo ""

# 步骤 4: 验证
echo "✅ 步骤 4/4: 验证部署..."
sleep 5
for path in / /login /register /dashboard /analyze /pricing /terms /privacy; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://alqedge.com$path")
  if [ "$code" = "200" ] || [ "$code" = "307" ]; then
    echo "  ✅ alqedge.com$path → $code"
  else
    echo "  ❌ alqedge.com$path → $code (期望 200)"
  fi
done

echo ""
echo "========================================="
echo "🎉 部署完成!"
echo "========================================="