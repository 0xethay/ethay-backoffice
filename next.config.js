/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos', 'ipfs.io'],
  },
};

module.exports = nextConfig;
