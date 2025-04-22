/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Change from 'standalone' to 'export' for static site generation
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Remove trailingSlash setting as it can cause issues with static exports
}

export default nextConfig
