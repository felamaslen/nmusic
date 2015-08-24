const path = require('path');
const webpack = require('webpack');
const moduleConfig = require('./module.config.js');

module.exports = {
  debug: true,
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:8081',
    'webpack/hot/only-dev-server',
    './code/js/index.jsx'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'App.wpbundle.js'
  },
  resolve: {
    extensions: ['', '.jsx', '.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: moduleConfig
};
