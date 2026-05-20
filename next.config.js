/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  basePath: '/admin',
  assetPrefix: '/admin',
  sassOptions: {
    includePaths: ['./src/styles'],
  },
};

module.exports = nextConfig;
