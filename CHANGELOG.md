# Changelog

本文件记录 alqedge-landing 的重要变更。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

## [Unreleased]

## [1.1.0] - 2026-08-27

### 🔒 安全升级（Security Upgrade）

**Next.js 14 → 15.5.24 主版本升级**（安全动因：next 14.x 已退出官方安全更新范围，本次安全公告在 14.x 无修复版本）

- **next** `14.2.35` → `15.5.24`
- **react / react-dom** `18.3.1` → `19.2.8`
- **@opennextjs/cloudflare** `1.15.0` → `1.20.3`（官方明确支持 next 15.5.24）
- **wrangler** `4.110.0` → `4.125.0`
- **@types/react / @types/react-dom** `^18.3.0` → `^19.x`
- **eslint-config-next** `^14.2.0` → `^15.5.24`

### 破坏性改动迁移（Next 15 Breaking Changes）

- **4 处 server component `params` 改为 `async`**（Next 15 要求 async request APIs）：
  - `src/app/[locale]/layout.tsx`
  - `src/app/[locale]/explain/page.tsx`
  - `src/app/[locale]/privacy/page.tsx`
  - `src/app/[locale]/terms/page.tsx`
- **`lint` 命令**：`next lint`（15 已废弃）→ `eslint .`

### 保持不变（无需升级）

- `next-intl` 保持 `3.26.5`（peerDeps 已支持 next 15 + react 19）
- `@supabase/ssr` 保持 `0.12.0`（next-agnostic）
- `recharts 3.9.2` / `lucide-react 1.24.0` / `@base-ui/react 1.6.0`（均兼容 React 19）
- middleware（GeoIP 制裁拦截）无改动，15 无破坏性变更

### 验证

- ✅ 本地 `npm run build` 零错误（13 条路由全生成）
- ✅ `build:cf` 成功，worker.js 生成
- ✅ `deploy:cf` 部署成功，Pages 预览回归 307/200 正常
- ✅ 生产部署：merge upgrade-next-15 → master 触发 Pages 生产构建

### 已知问题（非本次升级引入）

- ⚠️ `alqedge.com` 域名全站 404：域名回源到 Railway（`x-railway-fallback: true`），未绑定到 Cloudflare Pages。7 月迁移遗留问题，已上报，待宇哥拍板处理。不影响升级验证（Pages 侧 `alqedge-landing.pages.dev` 正常）。
