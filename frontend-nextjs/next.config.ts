import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    eslint: {
    // Tắt ESLint khi build production
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
