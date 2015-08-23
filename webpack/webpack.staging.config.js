const path = require('path');
const webpack = require('webpack');
const moduleConfig = require('./module.config.js');

module.exports = {
  entry: [
    './code/js/index.jsx'
  ],
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],
  output: {
    path: path.join(__dirname, '../code/html'),
    filename: 'App.wpbundle.js'
  },
  module: moduleConfig,
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
