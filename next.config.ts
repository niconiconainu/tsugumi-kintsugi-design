import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    // 親ディレクトリにも lockfile があるため、ワークスペース root を明示する。
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
