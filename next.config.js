/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  sassOptions: {
    includePaths: ['./src/styles'],
  },
};

module.exports = nextConfig;
