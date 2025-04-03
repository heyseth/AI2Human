/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/AI2Human' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/AI2Human' : '',
  trailingSlash: true,
};

module.exports = nextConfig;