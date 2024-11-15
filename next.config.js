/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['example.com'],
  }
};

module.exports = nextConfig; 