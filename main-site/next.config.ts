import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow the shared workspace package to be transpiled by Next.js
  transpilePackages: ['@highland/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
