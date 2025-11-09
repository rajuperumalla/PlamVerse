
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverActions: {
    bodySizeLimit: '2mb', // Default is 1mb, increased for potentially larger image data URIs
    // Increase timeout for potentially long-running AI operations
    serverActions: {
        timeout: 120, // 2 minutes
    },
  },
};

export default nextConfig;
