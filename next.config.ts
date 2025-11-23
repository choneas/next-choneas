import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
  './locales/request.ts'
)

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.notion.so"
      }
    ],
    minimumCacheTTL: 86400,
    formats: ['image/webp'],
  },
  allowedDevOrigins: ['127.0.0.1'],
  cacheComponents: true,
};

export default withNextIntl(nextConfig);
