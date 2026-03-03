/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable Turbopack for production builds to avoid module resolution issues
  experimental: {
    turbo: undefined,
  },
}

export default nextConfig
