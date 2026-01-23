/**
 * Fichier : next.config.mjs
 * Rôle : Configuration Next.js optimisée pour la production
 * Architecture : Performance, SEO et sécurité
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration stricte pour la production
  reactStrictMode: true,

  // Optimisations de compilation
  swcMinify: true,

  // Configuration des images
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers de sécurité
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
          },
        ],
      },
    ]
  },

  // Compression
  compress: true,

  // Power par App Router
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Variables d'environnement publiques
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'ERP Scolaire',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
}

export default nextConfig