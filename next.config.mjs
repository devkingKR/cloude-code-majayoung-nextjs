/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/cloude-code-majayoung-nextjs',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
};

export default nextConfig;