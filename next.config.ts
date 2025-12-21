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
      },
      {
        protocol: "https",
        hostname: "cdn.bsky.app"
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com"
      }
    ],
    minimumCacheTTL: 86400,
    formats: ['image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    dangerouslyAllowLocalIP: true,
  },
  allowedDevOrigins: ['127.0.0.1'],
  cacheComponents: true,
};

export default withNextIntl(nextConfig);
