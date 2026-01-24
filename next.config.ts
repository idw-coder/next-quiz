import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // GitHub Actionsでビルドしてサーバーに転送するため
};

export default nextConfig;
