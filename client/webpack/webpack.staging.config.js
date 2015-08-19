var path = require('path');
var webpack = require('webpack');
var moduleConfig = require('./module.config.js');

module.exports = {
  entry: [
    './code/js/index.jsx'
  ],
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],
  output: {
    path: path.join(__dirname, '../code/html'),
    filename: 'app.js'
  },
  module: moduleConfig,
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
