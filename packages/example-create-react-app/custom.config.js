module.exports = {
  babel: {
    plugins: process.env.NODE_ENV === 'production' ? [['system-css/babel', { outDir: 'src' }]] : []
  }
};
