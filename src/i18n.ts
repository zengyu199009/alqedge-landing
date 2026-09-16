import { getRequestConfig } from "next-intl/server";
import { defaultLocale } from "@/navigation";

// next-intl 3.22+ 推荐写法：使用 requestLocale 替代已弃用的 locale 参数
// 兼容 opennext/Cloudflare 等 middleware 不传递 locale 的场景，避免全站 404
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}/common.json`)).default,
  };
});
