const configWithBabel = require('next-split-babelrc');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: configWithBabel
};

module.exports = nextConfig;
