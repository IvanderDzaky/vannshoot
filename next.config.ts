import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  typedRoutes: true,
  reactCompiler: true,
  reactStrictMode: true,
  // Remove X-Powered-By header (improves Best Practices score)
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
    proxyClientMaxBodySize: 52428800,
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tibatibangoding.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Proxy Cloudflare beacon via same-origin to prevent ERR_BLOCKED_BY_CLIENT
  async rewrites() {
    return [
      {
        // Intercept Cloudflare Web Analytics beacon requests via cdn-cgi
        source: '/cdn-cgi/rum',
        destination: '/api/beacon',
      },
    ];
  },
  // Security & performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
