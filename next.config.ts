/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: '/home/iovann/Documents/projet/horizon-benin-properties',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
