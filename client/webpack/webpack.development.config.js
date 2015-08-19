var path = require('path');
var webpack = require('webpack');
var moduleConfig = require('./module.config.js');

module.exports = {
  debug: true,
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './code/js/index.jsx'
  ],
  output: {
    path: path.join(__dirname, './code/html'),
    filename: 'app.js'
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
