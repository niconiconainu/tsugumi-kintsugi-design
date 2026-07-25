import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Next.js 16 で `middleware` は `proxy` へ改称された（`middleware.ts` は非推奨）。
 * next-intl のロケール解決をここに載せる。
 */
export default createMiddleware(routing);

export const config = {
  // API と静的アセットはロケール解決の対象外。
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
