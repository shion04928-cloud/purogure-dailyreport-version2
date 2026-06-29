import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/daily',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
