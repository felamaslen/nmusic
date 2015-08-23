module.exports = {
  loaders: [
    {
      test: /\.jsx$|\.js$/,
      exclude: /node_modules/,
      loader: 'babel?optional[]=runtime,stage=1'
    },
    { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000&minetype=application/font-woff' },
    { test: /\.(ttf|eot|svg|png|jpg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file' },
    { test: /\.less$/, loader: 'style!css!autoprefixer!less' }
  ]
};
