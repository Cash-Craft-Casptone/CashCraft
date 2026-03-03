/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Force webpack bundler instead of Turbopack
  webpack: (config) => {
    return config;
  },
  // Force fresh build
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

export default nextConfig
