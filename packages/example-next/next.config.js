const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config, options) => {
    if (options.isServer) return config;

    const newConfig = {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.js/,
            use: [
              {
                ...options.defaultLoaders.babel,
                options: {
                  ...options.defaultLoaders.babel.options,
                  configFile: path.resolve('.babelrc-client.js')
                }
              }
            ]
          }
        ]
      }
    };

    return newConfig;
  }
};

module.exports = nextConfig;
