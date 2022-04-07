const path = require('path');
const cloneDeep = require('lodash.clonedeep');

const addBabelConfigs = (config, options) => {
  const newConfig = cloneDeep(config);
  const babelLoader = cloneDeep(options.defaultLoaders.babel);

  if (options.isServer) babelLoader.options.configFile = path.resolve('.babelrc.server.js');
  else babelLoader.options.configFile = path.resolve('.babelrc.client.js');

  newConfig.module.rules.push({ test: /\.js|ts|jsx|tsx/, use: [babelLoader] });
  return newConfig;
};

module.exports = addBabelConfigs;
