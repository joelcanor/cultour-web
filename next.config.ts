// next.config.ts - REEMPLAZA TU ARCHIVO ACTUAL
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: [
      'yiaplofsopkyasrkhjhf.supabase.co',
      'cdn-icons-png.flaticon.com',
      'static.thenounproject.com',
      'cultour-web-fpd3.vercel.app',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
    ]
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.cultour-web-fpd3.vercel.app',
          },
        ],
        destination: 'https://cultour-web-fpd3.vercel.app/:path*',
        permanent: true,
      },
    ]
  },

  compress: true,
  trailingSlash: false,
  productionBrowserSourceMaps: false,
};

export default nextConfig;