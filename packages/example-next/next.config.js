const splitConfig = require('next-split-babelrc');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: splitConfig
};

module.exports = nextConfig;
