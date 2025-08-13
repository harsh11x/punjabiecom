/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'vercel.app', 'punjabijuttiandfulkari.com'],
  },
  serverExternalPackages: ['mongoose'],
}

export default nextConfig
