// use with next-split-babelrc

module.exports = {
  server: { presets: ['next/babel'] },
  client: { presets: ['next/babel'], plugins: ['system-css/babel'] }
};
