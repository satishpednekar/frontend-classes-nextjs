/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/_next/static/media/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
        ],
      },
      {
        source: '/_next/static/chunks/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
        ],
      },
      {
        source: '/_next/static/css/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
        ],
      },
      {
        source: '/studio/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
        ],
      },
      {
        source: '/debug/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' }
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    remotePatterns: [{ hostname: "cdn.sanity.io" }]
  },
  typescript: {
    // Set this to false if you want production builds to abort if there's type errors
    ignoreBuildErrors: process.env.VERCEL_ENV === "production"
  },
  eslint: {
    /// Set this to false if you want production builds to abort if there's lint errors
    ignoreDuringBuilds: process.env.VERCEL_ENV === "production"
  }
};

module.exports = nextConfig;
