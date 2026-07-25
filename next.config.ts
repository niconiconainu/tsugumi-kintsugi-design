import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    // 親ディレクトリにも lockfile があるため、ワークスペース root を明示する。
    root: path.resolve(__dirname),
  },
};

export default withNextIntl(nextConfig);
