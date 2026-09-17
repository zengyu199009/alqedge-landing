// open-next.config.ts - @opennextjs/cloudflare configuration
// 部署目标：Cloudflare Workers（原 Pages 配置存在静态资源路径错位问题，已迁移）
//
// 增量缓存用 staticAssetsIncrementalCache：直接复用 Workers 静态资源，
// 不需要 R2/KV 等额外资源与权限。本落地页只服务预渲染内容、不做 revalidation，符合其适用前提。
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
	incrementalCache: staticAssetsIncrementalCache,
});
