import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow the shared workspace package to be transpiled by Next.js
  transpilePackages: ['@highland/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'leathergoods.es',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
      },
    ],
  },
};

export default nextConfig;
