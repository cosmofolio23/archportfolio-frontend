/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore TypeScript errors in legacy dashboard files
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
