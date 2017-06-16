const path = require('path');
const MATCH_ALL_NON_RELATIVE_IMPORTS = /^\w.*$/i;

module.exports = [
  {
    entry: {
      resampler: './src/resampler.js'
    },
    output: {
      filename: '[name].js',
      libraryTarget: 'window',
      path: path.join(__dirname, 'lib'), // where to place webpack files
    },
    module: {
      loaders: [{
        test: /\.js$/,
        loader: 'babel-loader',
      }],
    },
    target: 'web',
  },
];