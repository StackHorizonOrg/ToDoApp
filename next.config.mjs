/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/trpc/:path*',
          destination: '/api/trpc/:path*',
        },
      ],
    }
  },
}

export default nextConfig;
